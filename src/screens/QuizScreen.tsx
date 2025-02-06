import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { fetchUserProgress, updateUserProgress } from '../services/userProgress';
import CodeEditor from '../components/common/CodeEditor';
import { languageInfo } from '../data/languageLessons';
import { ProgrammingLanguage, Difficulty, Lesson } from '../types/quiz';
import QuizModal from '../components/quiz/QuizModal';
import { SvgUri } from 'react-native-svg';

const QuizScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Beginner');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadUserProgress = async () => {
    if (user) {
      const progress = await fetchUserProgress(user.uid);
      setUserProgress(progress);
      setLoading(false);
    }
  };

  const LanguageSelector = () => (
    <ScrollView style={styles.languageList}>
      {Object.entries(languageInfo).map(([lang, info]) => (
        <TouchableOpacity
          key={lang}
          style={[styles.languageCard, { borderColor: info.color }]}
          onPress={() => setSelectedLanguage(lang as ProgrammingLanguage)}
        >
          {info.icon.endsWith('.svg') ? (
            <SvgUri
              width={40}
              height={40}
              uri={info.icon}
              style={styles.languageIcon}
            />
          ) : (
            <Image
              source={{ uri: info.icon }}
              style={styles.languageIcon}
              resizeMode="contain"
            />
          )}
          <View style={styles.languageHeader}>
            <Text style={[styles.languageTitle, { color: info.color }]}>{lang}</Text>
          </View>
          <Text style={styles.languageDescription}>{info.description}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${calculateProgress(lang)}%`,
                  backgroundColor: info.color,
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {calculateProgress(lang)}% Complete
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const calculateProgress = (language: string): number => {
    if (!user || !userProgress) return 0;
    
    const languageLessons = Object.values(languageInfo[language as ProgrammingLanguage].lessons)
      .flat();
    
    const completedLessons = languageLessons.filter(
      lesson => userProgress[lesson.id]
    ).length;

    return Math.round((completedLessons / languageLessons.length) * 100);
  };

  const handleLessonComplete = async (lessonId: string) => {
    if (user) {
      const updatedProgress = { ...userProgress, [lessonId]: true };
      await updateUserProgress(user.uid, updatedProgress);
      setUserProgress(updatedProgress);
    }
  };

  const isLessonUnlocked = (difficulty: Difficulty, lessonOrder: number, language: ProgrammingLanguage): boolean => {
    if (difficulty === 'Beginner') {
      // First lesson is always unlocked
      if (lessonOrder === 1) return true;
      
      // Check if previous lesson in Beginner is completed
      const previousLesson = languageInfo[language].lessons.Beginner
        .find(lesson => lesson.order === lessonOrder - 1);
      return previousLesson ? !!userProgress[previousLesson.id] : false;
    }

    if (difficulty === 'Intermediate') {
      // Check if all Beginner lessons are completed
      const beginnerLessons = languageInfo[language].lessons.Beginner;
      const allBeginnerCompleted = beginnerLessons.every(
        lesson => userProgress[lesson.id]
      );
      
      if (!allBeginnerCompleted) return false;
      
      // Check if previous Intermediate lesson is completed
      if (lessonOrder > 1) {
        const previousLesson = languageInfo[language].lessons.Intermediate
          .find(lesson => lesson.order === lessonOrder - 1);
        return previousLesson ? !!userProgress[previousLesson.id] : false;
      }
      
      return true;
    }

    if (difficulty === 'Advanced') {
      // Check if all Intermediate lessons are completed
      const intermediateLessons = languageInfo[language].lessons.Intermediate;
      const allIntermediateCompleted = intermediateLessons.every(
        lesson => userProgress[lesson.id]
      );
      
      if (!allIntermediateCompleted) return false;
      
      // Check if previous Advanced lesson is completed
      if (lessonOrder > 1) {
        const previousLesson = languageInfo[language].lessons.Advanced
          .find(lesson => lesson.order === lessonOrder - 1);
        return previousLesson ? !!userProgress[previousLesson.id] : false;
      }
      
      return true;
    }

    return false;
  };

  const getLessonStatus = (lesson: Lesson, language: ProgrammingLanguage) => {
    if (userProgress[lesson.id]) {
      return 'completed';
    }
    if (isLessonUnlocked(lesson.difficulty, lesson.order, language)) {
      return 'unlocked';
    }
    return 'locked';
  };

  const getLessonsForLanguage = (language: ProgrammingLanguage, difficulty: Difficulty): Lesson[] => {
    return languageInfo[language].lessons[difficulty];
  };

  const handleQuizComplete = async (score: number) => {
    if (user && currentLesson) {
      // Only update progress if the user passed the quiz
      if (score >= PASSING_SCORE) {
        const updatedProgress = { ...userProgress, [currentLesson.id]: true };
        await updateUserProgress(user.uid, updatedProgress);
        setUserProgress(updatedProgress);
      }
      setShowQuiz(false);
      setCurrentLesson(null);
    }
  };

  const handleStartQuiz = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setShowQuiz(true);
  };

  const renderLessonCard = (lesson: Lesson) => (
    <TouchableOpacity
      key={lesson.id}
      style={[
        styles.lessonCard,
        getLessonStatus(lesson, selectedLanguage!) === 'locked' && styles.lockedLesson,
        getLessonStatus(lesson, selectedLanguage!) === 'completed' && styles.completedLesson,
      ]}
      onPress={() => {
        if (getLessonStatus(lesson, selectedLanguage!) === 'locked') {
          Alert.alert(
            'Lesson Locked',
            'Complete the previous lessons to unlock this one!'
          );
          return;
        }
        setCurrentLesson(lesson);
      }}
      disabled={getLessonStatus(lesson, selectedLanguage!) === 'locked'}
    >
      <View style={styles.lessonHeader}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        {getLessonStatus(lesson, selectedLanguage!) === 'completed' && (
          <Icon name="check-circle" size={24} color="#4CAF50" />
        )}
        {getLessonStatus(lesson, selectedLanguage!) === 'locked' && (
          <Icon name="lock" size={24} color="#999" />
        )}
      </View>
      <Text style={styles.lessonDescription}>
        {lesson.content.split('\n')[0]}
      </Text>
      {getLessonStatus(lesson, selectedLanguage!) === 'locked' && (
        <Text style={styles.lockMessage}>
          Complete previous lessons to unlock
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!selectedLanguage ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Programming Languages</Text>
            <Text style={styles.subtitle}>Select a language to start learning</Text>
          </View>
          <LanguageSelector />
        </>
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedLanguage(null)}
              >
                <Icon name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.title}>{selectedLanguage} Programming</Text>
            </View>
            <View style={styles.difficultySelector}>
              {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <TouchableOpacity
                  key={diff}
                  style={[
                    styles.difficultyButton,
                    selectedDifficulty === diff && styles.selectedDifficulty,
                  ]}
                  onPress={() => setSelectedDifficulty(diff as Difficulty)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      selectedDifficulty === diff && styles.selectedDifficultyText,
                    ]}
                  >
                    {diff}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2196F3" />
          ) : (
            <ScrollView style={styles.lessonList}>
              {getLessonsForLanguage(selectedLanguage, selectedDifficulty).map((lesson) => (
                renderLessonCard(lesson)
              ))}
            </ScrollView>
          )}

          {/* Lesson Modal */}
          <Modal
            visible={!!currentLesson}
            animationType="slide"
            onRequestClose={() => setCurrentLesson(null)}
          >
            {currentLesson && (
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setCurrentLesson(null)}
                  >
                    <Icon name="close" size={24} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{currentLesson.title}</Text>
                </View>
                <ScrollView style={styles.modalContent}>
                  <Text style={styles.lessonContent}>{currentLesson.content}</Text>
                  {currentLesson.codeExamples.map((example, index) => (
                    <CodeEditor
                      key={index}
                      code={example}
                      language="python"
                      readOnly={true}
                    />
                  ))}
                </ScrollView>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.startQuizButton}
                    onPress={() => {
                      handleStartQuiz(currentLesson);
                    }}
                  >
                    <Text style={styles.buttonText}>Start Quiz</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Modal>

          {/* Quiz Modal */}
          {showQuiz && currentLesson && (
            <QuizModal
              visible={showQuiz}
              onClose={() => {
                setShowQuiz(false);
                setCurrentLesson(null);
              }}
              lessonId={currentLesson.id}
              onComplete={handleQuizComplete}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  difficultySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  difficultyButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedDifficulty: {
    backgroundColor: '#2196F3',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedDifficultyText: {
    color: '#fff',
  },
  lessonList: {
    flex: 1,
    padding: 16,
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  lockedLesson: {
    opacity: 0.7,
    backgroundColor: '#f5f5f5',
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  lessonContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  startQuizButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageList: {
    flex: 1,
    padding: 16,
  },
  languageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderLeftWidth: 4,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  languageIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  languageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  languageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  completedLesson: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  lockMessage: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default QuizScreen; 