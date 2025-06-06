import React from 'react';
import { View, Text, Switch, TouchableHighlight, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { lightStyles, darkStyles } from '../styles/SettingScreenStyle';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/AuthSlice';
import API from '../api';
import { useTheme } from '../context/ThemeContext'; 

// Import components
import BackButton from '../components/BackButton';


export default function SettingScreen({ navigation }) {
  const { isDarkMode, toggleTheme, useSystemTheme, setUseSystemTheme } = useTheme();
  const dispatch = useDispatch();
  const styles = isDarkMode ? darkStyles : lightStyles;

  // Access user data from the Redux store
  const user = useSelector((state) => state.auth.user);

  // Extract userId
  const userId = user ? user.id : null;

  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              dispatch(logout());
              navigation.navigate('Login');
            } 

            catch (error) {
              Alert.alert('Error', 'Logout failed. Please try again later.');
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Deleting the account means all information stored in our database will be wiped. Are you sure you want to delete the account?",
      [
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await API.post('/api/user/delete-account', {
                user_id: userId
              });

              dispatch(logout());
              navigation.navigate('Login');
              Alert.alert('Success', 'Account deleted successfully.');
            } 
            
            catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again later.');
              console.log(error);
            }
          }
        }
      ]
    );
  };



  const previousPage = () => {
    navigation.goBack();

  }



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={previousPage} />
        <Text style={styles.title}>Settings</Text>
        
      </View>

      <View style={styles.menu}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#808080", true: "#808080" }}
            thumbColor="#FFFFFF"
            onValueChange={() => {
              if (useSystemTheme) {
                setUseSystemTheme(false);
              }

              toggleTheme();

            }}

            value={isDarkMode}

          />

        </View>

        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.logoutButton} onPress={handleLogout} underlayColor={isDarkMode ? '#999999' : '#999999'}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableHighlight>


          <TouchableHighlight style={styles.acctDeleteButton} onPress={handleDeleteAccount} underlayColor={isDarkMode ? '#999999' : '#999999'}>
            <Text style={styles.acctDeleteButtonText}>Delete Account</Text>
          </TouchableHighlight>

        </View>

      </View>

    </SafeAreaView>

  );

}
