import React, { useState } from 'react';
import { View, Text, TextInput, TouchableHighlight, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightStyles, darkStyles } from '../styles/EditProfileScreenStyle';
import { useTheme } from '../context/ThemeContext'; 
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import API from '../api';
import BackButton from '../components/BackButton';


const EditProfileScreen = ({ route, navigation }) => {
  const { userDetails } = route.params;
  const [username, setUsername] = useState(userDetails.username);
  const [email, setEmail] = useState(userDetails.email);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.auth.user.id);
  const [errorMessage, setErrorMessage] = useState('');
  const { isDarkMode } = useTheme(); 
  const styles = isDarkMode ? darkStyles : lightStyles; 


  const handleProfileUpdate = async () => {
    // Prevent multiple requests if already loading
    if (loading) return;
    setLoading(true);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Error', 'Invalid email format!');
      return;

    }

    try {
      
      const response = await API.post('/api/user/update-account', { username: trimmedUsername, email: trimmedEmail, user_id: userId });

      if (response.status === 200) {
        Toast.show({ type: 'success', position: 'bottom', text1: 'Profile updated successfully', visibilityTime: 2000, autoHide: true, bottomOffset: 60 });
        navigation.goBack();

      }

      else if (response.status === 400) {
        const { error } = response.data;
        setErrorMessage(error);

      }

    } 
    
    catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile. Please try again later.';
      Alert.alert('Error', errorMessage);

    } 
    
    finally {
      // Add a delay before resetting loading state
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }

  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.title}>Edit Profile</Text>

        </View>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>

        ) : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" cursorColor="#000000" />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" cursorColor="#000000" />

        </View>

        <TouchableHighlight style={styles.saveButton} underlayColor={isDarkMode ? '#999999' : '#999999'} onPress={handleProfileUpdate} disabled={loading} >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableHighlight>

      </ScrollView>

    </SafeAreaView>

  );

};


export default EditProfileScreen;
