import React, { useState } from 'react';
import { View, Text, TextInput, TouchableHighlight, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightStyles, darkStyles } from '../styles/EditPasswordScreenStyle';
import { useTheme } from '../context/ThemeContext';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import API from '../api';
import { Ionicons } from '@expo/vector-icons';


import BackButton from '../components/BackButton';



const EditPasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.auth.user.id);
  const [errorMessage, setErrorMessage] = useState('');
  const { isDarkMode } = useTheme();
  const styles = isDarkMode ? darkStyles : lightStyles;
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const commonWords = ["password", "123456", "12345678", "qwerty", "abc123"];
    const isCommon = commonWords.some(word => password.toLowerCase().includes(word));

    if (password.length < minLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers) return 'Password must contain at least one number';
    if (!hasSpecialChars) return 'Password must contain at least one special character';
    if (isCommon) return 'Password is too common';

    return '';
    
  };



  const handleUpdatePassword = async () => {
    // Prevent multiple requests if already loading
    if (loading) return;
    setLoading(true);

    const trimmedCurrentPassword = currentPassword.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedRepeatPassword = repeatPassword.trim();

    if (trimmedNewPassword !== trimmedRepeatPassword) {
      setErrorMessage('New password and repeat password do not match');
      return;
    }

    const validationError = validatePassword(trimmedNewPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      const response = await API.post('/api/user/change-password', { user_id: userId, currentPassword: trimmedCurrentPassword, newPassword: newPassword });

      if (response.status === 200) {
        Toast.show({ type: 'success', position: 'bottom', text1: 'Password updated successfully', visibilityTime: 2000, autoHide: true, bottomOffset: 60, });
        // Go back to previous screen
        navigation.goBack();

      }

      else if (response.status === 400) {
        const { error } = await response.json();
        setErrorMessage(error);

      }

    }

    catch (error) {
      if (error.response && error.response.status === 400) {
        const { error: errorMessage } = error.response.data;
        setErrorMessage(errorMessage);
      }

      else {
        console.error('Error updating password:', error);
        Alert.alert('Error', 'Failed to update password. Please try again later.');

      }

    } 
    
    finally {
      // Add a delay before resetting loading state
      setTimeout(() => {
        setLoading(false);
      }, 500);

    }

  };


  const previousPage = () => {
    navigation.goBack();

  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={previousPage} />
          <Text style={styles.title}>Edit Password</Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput style={styles.input} value={currentPassword} placeholder='Current Password' onChangeText={setCurrentPassword} secureTextEntry={!showCurrentPassword} cursorColor="#000000" />
            <TouchableHighlight style={styles.icon} onPress={() => setShowCurrentPassword(!showCurrentPassword)} underlayColor={isDarkMode ? '#999999' : '#999999'}>
              <Ionicons name={showCurrentPassword ? 'eye-off' : 'eye'} size={24}/>
            </TouchableHighlight>

          </View>


          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput style={styles.input} value={newPassword} placeholder='New Password' onChangeText={setNewPassword} secureTextEntry={!showNewPassword} cursorColor="#000000" />
            <TouchableHighlight style={styles.icon} onPress={() => setShowNewPassword(!showNewPassword)} underlayColor={isDarkMode ? '#999999' : '#999999'} >
              <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={24}/>
            </TouchableHighlight>
          </View>


          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput style={styles.input} value={repeatPassword} placeholder='Confirm Password' onChangeText={setRepeatPassword} secureTextEntry={!showConfirmPassword} cursorColor="#000000" />
            <TouchableHighlight style={styles.icon} onPress={() => setShowConfirmPassword(!showConfirmPassword)} underlayColor={isDarkMode ? '#999999' : '#999999'} >
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} />
            </TouchableHighlight>

          </View>

        </View>

        <TouchableHighlight style={styles.saveButton} underlayColor={isDarkMode ? '#999999' : '#999999'} onPress={handleUpdatePassword} disabled={loading}>
          <Text style={styles.saveButtonText}>Update Password</Text>
        </TouchableHighlight>

      </ScrollView>

    </SafeAreaView>


  );


};

export default EditPasswordScreen;