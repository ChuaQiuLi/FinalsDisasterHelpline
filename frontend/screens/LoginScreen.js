import React, { useState } from 'react';
import { View, Text, TextInput, TouchableHighlight, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch} from 'react-redux';
import { loginUser } from '../slices/AuthSlice';
import { lightStyles, darkStyles } from '../styles/LoginScreenStyle';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const styles = isDarkMode ? darkStyles : lightStyles;
  const [showPassword, setShowPassword] = useState(false);

  const logoSource = isDarkMode
    ? require('../assets/icon_dark.png')
    : require('../assets/icon_light.png');

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Validate inputs
    if (!trimmedUsername || !trimmedPassword) {
      Alert.alert('Error', 'Username and password are required.');
      return;
    }

    // Must use await to make sure login is successful before proceeding.
    // Don't delete as highlighted by code editor.
    const result = await dispatch(loginUser({ username: trimmedUsername, password: trimmedPassword }));
    if (loginUser.fulfilled.match(result)) {
      const token = await SecureStore.getItemAsync('token');
    } else {
      Alert.alert('Login failed', 'Invalid username or password');
    }
  };

  
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.logoContainer}>
          <Image source={logoSource} style={styles.logo} />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Login</Text>
          </View>
          <View style={styles.usernameContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          </View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
            <TouchableHighlight 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.icon}
              underlayColor={isDarkMode ? '#999999' : '#999999'}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
              />
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.linkContainer}>
          <TouchableHighlight
            underlayColor={isDarkMode ? '#999999' : '#999999'}
            onPress={() => navigation.navigate('ForgetPassword')}
          >
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableHighlight>

          <Text style={styles.registerText}>
            New to Don't Stress Now?{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>
              Register Here
            </Text>
          </Text>
        </View>
        <TouchableHighlight
          style={styles.loginButton}
          underlayColor={isDarkMode ? '#999999' : '#999999'}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableHighlight>
      </ScrollView>
    </SafeAreaView>
  );
}
