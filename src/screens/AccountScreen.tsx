import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationProp } from '../types/navigation';
import * as ImagePicker from 'expo-image-picker';
import { logOut } from '../services/firebase';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AccountScreen = () => {
  const { user, setUser } = useUser();
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(user?.fullName || '');

  const userRewards = user?.rewards || { points: 0, badges: [], completedQuizzes: 0 };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logOut();
              setUser(null);
              navigation.replace('Login');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setEditedName(user?.fullName || '');
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (user) {
      setUser({
        ...user,
        fullName: editedName,
      });
    }
    setIsEditModalVisible(false);
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      if (user) {
        setUser({
          ...user,
          profileImage: result.assets[0].uri,
        });
      }
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please log in to view your account</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePickImage} style={styles.profileImageContainer}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="person" size={40} color="#fff" />
              </View>
            )}
            <View style={styles.editImageButton}>
              <Icon name="camera-alt" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsOverview}>
        <View style={styles.statCard}>
          <Icon name="stars" size={32} color="#FFD700" />
          <Text style={styles.statValue}>{userRewards.points}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="quiz" size={32} color="#2196F3" />
          <Text style={styles.statValue}>{userRewards.completedQuizzes}</Text>
          <Text style={styles.statLabel}>Quizzes Completed</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earned Badges</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgesContainer}
        >
          {userRewards.badges.length > 0 ? (
            userRewards.badges.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <View style={styles.badgeIconContainer}>
                  <Icon name={badge.icon} size={32} color="#2196F3" />
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noBadgesContainer}>
              <Icon name="emoji-events" size={48} color="#ccc" />
              <Text style={styles.noBadgesText}>Complete quizzes to earn badges!</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <View style={styles.menuIconContainer}>
            <Icon name="edit" size={24} color="#2196F3" />
          </View>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Icon name="settings" size={24} color="#2196F3" />
          </View>
          <Text style={styles.menuText}>Settings</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Help')}
        >
          <View style={styles.menuIconContainer}>
            <Icon name="help" size={24} color="#2196F3" />
          </View>
          <Text style={styles.menuText}>Help & Support</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutButton]} 
          onPress={handleLogout}
        >
          <View style={[styles.menuIconContainer, styles.logoutIcon]}>
            <Icon name="logout" size={24} color="#f44336" />
          </View>
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.modalInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Full Name"
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  statsOverview: {
    flexDirection: 'row',
    marginTop: -30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  badgesContainer: {
    paddingRight: 20,
  },
  badgeCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: width * 0.6,
    elevation: 3,
  },
  badgeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  badgeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noBadgesContainer: {
    width: width - 40,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
  },
  noBadgesText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 15,
    marginHorizontal: 20,
    paddingVertical: 5,
    elevation: 3,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutIcon: {
    backgroundColor: '#ffebee',
  },
  logoutText: {
    color: '#f44336',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AccountScreen; 