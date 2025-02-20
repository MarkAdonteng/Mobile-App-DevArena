import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { AuthScreenNavigationProp } from '../../types/navigation';
import { useUser } from '../../context/UserContext';
import { signIn } from '../../services/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

type Props = {
  navigation: AuthScreenNavigationProp;
};

const LoginScreen: React.FC<Props & { navigation: StackNavigationProp<RootStackParamList, 'Login'> }> = ({ navigation }) => {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const userData = await signIn(
        email.trim(), 
        password.trim()
      );
      if (userData) {
        setUser({
          uid: userData.uid,
          email: userData.email,
          fullName: userData.fullName,
          completedModules: userData.completedModules || [],
          achievements: userData.achievements || [],
          rewards: {
            points: 0,
            badges: [],
            completedQuizzes: 0
          }
        });
        navigation.replace('MainApp');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://img.freepik.com/free-vector/gradient-coding-logo-template_23-2148809439.jpg' }}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>EduPlay</Text>
            {/* <Text style={styles.appName}>DevArena</Text> */}
            <Text style={styles.subtitle}>Where Code Meets Excellence</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.buttonGradient}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Logging in...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signupLink}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.signupText}>
                New to EduPlay? <Text style={styles.signupTextBold}>Create Account</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: -5,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCC',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputIcon: {
    padding: 15,
    color: '#FFF',
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    paddingVertical: 15,
  },
  eyeIcon: {
    padding: 15,
  },
  loginButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  signupLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    color: '#CCC',
    fontSize: 16,
  },
  signupTextBold: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default LoginScreen; 