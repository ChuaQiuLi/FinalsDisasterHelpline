import React, { useState } from 'react';
import { View, Text, TextInput, TouchableHighlight, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch} from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { loginUser } from '../slices/AuthSlice';
import { lightStyles, darkStyles } from '../styles/LoginScreenStyle';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';




const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const styles = isDarkMode ? darkStyles : lightStyles;
  const [showPassword, setShowPassword] = useState(false);
  const loginButtonDisabled = !username.trim() || !password.trim();


  const logoSource = isDarkMode ? require('../assets/icon_dark.png') : require('../assets/icon_light.png');


  const handleLogin = async () => { 
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();


    // Must use await to make sure login is successful before proceeding.
    const result = await dispatch(loginUser({ username: trimmedUsername, password: trimmedPassword }));
    if (loginUser.fulfilled.match(result)) {
      const token = await SecureStore.getItemAsync('token');
    } 
    
    else {
      Alert.alert('Login failed', 'Invalid username or password');
    }


  };

  
  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContent} enableOnAndroid={true} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image source={logoSource} style={styles.logo} />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Login</Text>
          </View>

          <View style={styles.usernameContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCorrect={false} autoCapitalize="none" cursorColor="#000000" />

          </View>

          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} autoCorrect={false} autoCapitalize="none" secureTextEntry={!showPassword} cursorColor="#000000" />
            
            <TouchableHighlight onPress={() => setShowPassword(!showPassword)} style={styles.icon} underlayColor={isDarkMode ? '#999999' : '#999999'}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24}/>
            </TouchableHighlight>

          </View>

        </View>

        <View style={styles.linkContainer}>
          <TouchableHighlight underlayColor={isDarkMode ? '#999999' : '#999999'} onPress={() => navigation.navigate('ForgetPassword')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableHighlight>

          <Text style={styles.registerText}> New to Disaster Helpline?{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}> Register Here </Text>
          </Text>

        </View>

        <TouchableHighlight style={[styles.loginButton, (loginButtonDisabled || loading) && styles.loginButtonDisabled ]} underlayColor={isDarkMode ? '#999999' : '#999999'} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableHighlight>

      </KeyboardAwareScrollView>

    </SafeAreaView>

  );

  
};


export default LoginScreen;
