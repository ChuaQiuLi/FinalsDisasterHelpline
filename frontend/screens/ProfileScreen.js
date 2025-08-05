import React, { useState, useEffect  } from 'react';
import { View, Text, TouchableHighlight, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused  } from '@react-navigation/native';
import { lightStyles, darkStyles }  from '../styles/ProfileScreenStyle';
import { useTheme } from '../context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import API from '../api';


const ProfileScreen = ({ navigation }) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const isFocused = useIsFocused();
  const { isDarkMode } = useTheme(); 
  const styles = isDarkMode ? darkStyles : lightStyles; 

  

  useEffect(() => {
    if (isFocused) {
      fetchUserDetails();
    }

  }, [isFocused, userId]);



  // Fetch user details
  const fetchUserDetails = async () => {
    // Make sure userId is not null first
    if (!userId) {
      Alert.alert('Error', 'User ID is not available');
      return;
    }

    try {
      const response = await API.get('/api/user/details',  { params: { user_id: userId }});
      
      if (response.status === 200) {
        const { username, email } = response.data;
        setUsername(username);
        setEmail(email);
      } 
      
      else {
        Alert.alert('Error', 'Failed to load user details');
      }

    } 
    
    catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'Failed to load user details');
    }

  };



  const setting = () => {
    navigation.navigate('SettingScreen');
  };


  const handleEditProfile = () => {
    const userDetails = { username, email };
    navigation.navigate('EditProfileScreen', { userDetails });

  };


  
  const viewBadges = () => {
    navigation.navigate('BadgeScreen');
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>

        <TouchableHighlight style={styles.settingsIconContainer} underlayColor={isDarkMode ? '#999999' : '#999999'} onPress={setting}>
          <Ionicons name="settings-outline" size={32} style={styles.settingsIcon} />
        </TouchableHighlight>

      </View>

      <MaterialCommunityIcons name="account-circle-outline" size={150} color={isDarkMode ? '#ffffff' : '#000000'} />

      <View style={styles.inputContainer}>
        <Text style={styles.usernameLabel}>Username</Text>
        <Text style={styles.usernameInput}>{username}</Text>
        <Text style={styles.emailLabel}>Email</Text>
        <Text style={styles.emailInput}>{email}</Text>

      </View>

      <TouchableHighlight underlayColor={isDarkMode ? '#999999' : '#999999'} style={styles.badgeButton} onPress={viewBadges}>
        <Text style={styles.badgeText}>View Earned Badges</Text>
      </TouchableHighlight>

      <TouchableHighlight underlayColor={isDarkMode ? '#999999' : '#999999'} style={styles.editProfileButton} onPress={handleEditProfile}>
        <Text style={styles.editProfileButtonText}>Edit Profile</Text>
      </TouchableHighlight>

    </SafeAreaView>

  );

};

export default ProfileScreen;