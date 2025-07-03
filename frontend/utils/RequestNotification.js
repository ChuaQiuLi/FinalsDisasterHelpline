import { useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import API from '../api';
import Toast from 'react-native-toast-message';



const usePushNotificationManager = (userId) => {
  const appState = useRef(AppState.currentState);
  const [expoPushToken, setExpoPushToken] = useState(null);


  // Check permission & update token
  const checkAndUpdateToken = async () => {
    if (!userId) {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'No user id',
        visibilityTime: 3000,
        bottomOffset: 60,
      });

      return;

    }

    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: 'PushNotificationManager',
      text2: 'userId present, proceeding with token registration',
      visibilityTime: 3000,
      bottomOffset: 60,
    });

    const hasPermission = await requestNotificationPermissions();
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: `Permission check result: ${hasPermission}`,
      visibilityTime: 3000,
      bottomOffset: 60,
    });


    if (!hasPermission) {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Notification permission not granted — skipping token generation.',
        visibilityTime: 3000,
        bottomOffset: 60,
      });

      console.log('Notification permission not granted — skipping token generation.');
      setExpoPushToken(null);
      return;

    }

    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: 'Permission granted — registering for push token',
      visibilityTime: 3000,
      bottomOffset: 60,

    });


    const newToken = await registerForPushNotificationsAsync();
    if (!newToken) {
      console.log('Failed to generate Expo push token.');
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Failed to generate Expo push token.',
        visibilityTime: 3000,
        bottomOffset: 60,
      });

      return;

    }


    if (newToken !== expoPushToken) {
      setExpoPushToken(newToken);

      try {
        await API.post('/api/user/saveExpoToken', { user_id: userId, expoPushToken: newToken });
        console.log('Expo push token saved to database:', newToken);

        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Push notifications enabled',
          visibilityTime: 3000,
          bottomOffset: 60,
        });

      }

      catch {
        console.log('Failed to save Expo push token:', error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Failed to save push token',
          text2: error.message || 'Unknown error',
          visibilityTime: 3000,
          bottomOffset: 60,
        });

      }

    }

  };


  // Set foreground notification behavior
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);


  
  // Run on mount & when app returns to foreground
  useEffect(() => {
    // on initial load

    checkAndUpdateToken(); 

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has returned to foreground — rechecking push token.');
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'App returned to foreground',
          visibilityTime: 3000,
          bottomOffset: 60,
        });

        checkAndUpdateToken();

      }

      appState.current = nextAppState;

    });

    return () => subscription.remove();

  }, [userId]);

    
  
  // Create Android notification channel on app start
  useEffect(() => {
    console.log('useEffect for notification channel start');

    Toast.show({
      type: 'success',
      text1: 'useEffect started',
      position: 'bottom',
      visibilityTime: 3000,
      bottomOffset: 60,
    });

    if (Platform.OS === 'android') {
      console.log('Platform is Android — creating notification channel...');
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',

      }).then(() => {
        console.log('Notification channel created');
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Notification channel created',
          visibilityTime: 3000,
          bottomOffset: 60,
        });


      }).catch((err) => {
        console.log('Failed to create notification channel:', err);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Failed to create notification channel',
          text2: err.message,
          visibilityTime: 3000,
          bottomOffset: 60,
        });

      });
      
    }

    else {
      console.log('Not Android platform — skipping notification channel creation');
    }
    
  }, []);


  // Request notification permission
  const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('Existing notification permission status:', existingStatus);

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
    
  };


  // Register device & get token
  const registerForPushNotificationsAsync = async () => {
    try {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Before calling getExpoPushTokenAsync',
        visibilityTime: 3000,
        bottomOffset: 60,
      });

      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      
      if (!projectId) {
        console.log('Project ID not found. Make sure EAS is configured properly.');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });


      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Project ID',
        text2: Constants.expoConfig?.extra?.eas?.projectId || 'Undefined',
        visibilityTime: 3000,
        bottomOffset: 60,
      });

      console.log('Generated push token:', tokenData?.data);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Generated push token',
        visibilityTime: 3000,
        bottomOffset: 60,
      });

      return tokenData.data;

    }

    catch (error) {
      console.error('Error getting Expo push token:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error getting Expo push token',
        text2: error?.message || JSON.stringify(error),
        visibilityTime: 5000,
        bottomOffset: 60,
      });

      return null;

    }


  };




};

export default usePushNotificationManager;
