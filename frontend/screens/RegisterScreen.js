import React, { useState } from 'react';
import { View, Text, TextInput, TouchableHighlight, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { lightStyles, darkStyles } from '../styles/RegisterScreenStyle';
import { useTheme } from '../context/ThemeContext';
import API from '../api';
import { Ionicons } from '@expo/vector-icons';




const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const { isDarkMode } = useTheme();
  const styles = isDarkMode ? darkStyles : lightStyles;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine the logo source based on the theme
  const logoSource = isDarkMode ? require('../assets/icon_dark.png') : require('../assets/icon_light.png');

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;

  };

  const handleSubmit = async () => {
    // Prevent multiple requests if already loading
    if (loading) return;
    setLoading(true);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (password !== trimmedConfirmPassword) {
        Alert.alert('Invalid Password', 'Password do not match');
        return;
      }


      if (!validatePassword(trimmedPassword)) {
        Alert.alert('Invalid Password Criteria', 'Password must be at least 8 characters long, and must contain 1 of upper and lower case letters, numbers, and special characters (e.g., @, #, $, %)');
        return;
      }


      if (!emailRegex.test(trimmedEmail)) {
        Alert.alert('Invalid Email', 'Email format is incorrect.');
        return;
      }


      const response = await API.post('/api/auth/register', { username: trimmedUsername, email: trimmedEmail, password: trimmedPassword });

      if (response.status === 200) {
        Alert.alert('Registration Success', 'Please login.');
        navigation.navigate('Login');

      }

      else if (response.status === 400) {
        const { error } = await response.json();
        Alert.alert('Error', error);

      }

    }

    catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to register. Please try again later.';
      Alert.alert('Error', errorMessage);
    }

    finally {
      // Add a delay before resetting loading state
      setTimeout(() => {
        setLoading(false);
      }, 500);

    }

  };


  const isRegisterDisabled = !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim();



  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContent} enableOnAndroid={true} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image source={logoSource} style={styles.logo} />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Register</Text>
          </View>

          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" cursorColor="#000000" />
          
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setemail} keyboardType="email-address" autoCapitalize="none" cursorColor="#000000" />

          <Text style={styles.label}>Password</Text>
           
          <View style={styles.passwordContainer}>
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} cursorColor="#000000" />
            <TouchableHighlight onPress={() => setShowPassword(!showPassword)} style={styles.icon} underlayColor={isDarkMode ? '#999999' : '#999999'} >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} />
            </TouchableHighlight>

          </View>

          <Text style={styles.label}>Confirm Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setconfirmPassword} secureTextEntry={!showConfirmPassword} cursorColor="#000000" />
            <TouchableHighlight onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.icon} underlayColor={isDarkMode ? '#999999' : '#999999'} >
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} />
            </TouchableHighlight>
          </View>

          <Text style={styles.description}> Password must be at least 8 characters long, and must contain 1 of upper and lower case letters, numbers, and special characters (e.g., @, #, $, %). </Text>
        </View>

        <View style={styles.linkContainer}>
          <Text style={styles.loginText}>
            Already Have An Account?{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
              Login Here
            </Text>
          </Text>
        </View>

        <TouchableHighlight style={[ styles.registerButton, (isRegisterDisabled || loading) && styles.registerButtonDisabled]} onPress={handleSubmit} disabled={isRegisterDisabled || loading} underlayColor={isDarkMode ? '#999999' : '#999999'} >
          <Text style={styles.registerButtonText}> {loading ? 'Registering...' : 'Register'} </Text>
        </TouchableHighlight>

      </KeyboardAwareScrollView>

    </SafeAreaView>

  );


}



export default RegisterScreen;



