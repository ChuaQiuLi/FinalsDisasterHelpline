import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Toast, {BaseToast} from 'react-native-toast-message'; 
import { useDispatch, Provider, useSelector } from 'react-redux';
import * as Notifications from 'expo-notifications';
import store from './store';
import { checkAuth } from './slices/AuthSlice';
import { useTheme } from './context/ThemeContext'; 





// Import HomeScreen component
import { ThemeProvider } from './context/ThemeContext';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgetPassword from './screens/ForgetPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import EmergencyContactScreen from './screens/EmergencyContactScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import ChecklistDetailScreen from './screens/ChecklistDetailScreen';
import AddChecklistScreen from './screens/AddChecklistScreen';
import QuizScreen from './screens/QuizScreen'
import QuizQuestionScreen from './screens/QuizQuestionScreen'
import ProfileScreen from './screens/ProfileScreen';
import SettingScreen from './screens/SettingScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ChangePasswordScreen from './screens/EditPasswordScreen';
import BadgeScreen from './screens/BadgeScreen';



// Create a tab navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



// Setup foreground notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // Show alert when in foreground
    shouldShowAlert: true,      
    // Play sound
    shouldPlaySound: true,      
    // iOS badge number
    shouldSetBadge: false,      

  }),
  
});



const AppContent = () => {
  const { isDarkMode, useSystemTheme } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.user?.id);
  const [themeLoading, setThemeLoading] = useState(true);
 


  React.useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);


  React.useEffect(() => {
    // Delay splsh screen so that theme can be added in
    const timer = setTimeout(() => setThemeLoading(false), 500); 
    return () => clearTimeout(timer);

  }, [isDarkMode, useSystemTheme]);


  if (loading || themeLoading) {
    return <SplashScreen />;
  }
  
  return (
    <NavigationContainer>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} translucent />
      <RootNavigator theme={theme} />
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
};


const App = () => (
  <Provider store={store}>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </Provider>
);


const RootNavigator = ({ theme }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen name="Main" options={{ headerShown: false }}>
          {(props) => <MainTabNavigator {...props} theme={theme} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }} />
        </>
      )}

    </Stack.Navigator>
  );

};


const MainTabNavigator = ({ navigation, theme }) => {
  
  return (
    <Tab.Navigator screenOptions={({ route }) => ({ 
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        
        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;

          case 'Emergency Guide':
            iconName = focused ? 'book' : 'book-outline';
            break;

          case 'Checklist':
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
            break;

          case 'Game':
            iconName = focused ? 'game-controller' : 'game-controller-outline';
            break;

          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
        }

        return <Ionicons name={iconName} size={size} color={color} />;
        
      },

      tabBarLabel: ({ color }) => (
        <Text style={{ color, fontSize: 12, textAlign: 'center', marginBottom: 5 }}>
          {route.name}
        </Text>
      ),

      tabBarActiveTintColor: theme.tabBarActiveTintColor,
      tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
      tabBarStyle: {
        display: 'flex',
        backgroundColor: theme.tabBarBackgroundColor,
        
      },

    })}

    >

    <Tab.Screen name="Home" component={HomeScreen} />

    <Tab.Screen name="Emergency Guide" component={EmergencyContactScreen} />


    <Tab.Screen 
      name="Checklist" 
      component={ChecklistStack} 
      listeners={({ navigation }) => ({ 
        tabPress: (e) => {
          if (e.defaultPrevented) return;
          e.preventDefault();

          navigation.reset({
            index: 0,
            routes: [{ name: 'Checklist' }],
          });
        },
      })}
    />


    <Tab.Screen 
      name="Game" 
      component={GameStack} 
      listeners={({ navigation }) => ({ 
        tabPress: (e) => {
          if (e.defaultPrevented) return;
          e.preventDefault();

          navigation.reset({
            index: 0,
            routes: [{ name: 'Game' }],
          });
        },
      })}
    />

    
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreenStack} 
      listeners={({ navigation }) => ({ 
        tabPress: (e) => {
          if (e.defaultPrevented) return;
          e.preventDefault();

          navigation.reset({
            index: 0,
            routes: [{ name: 'Profile' }],
          });
        },
      })}
    />


 

    </Tab.Navigator>


  );

};


const ChecklistStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ChecklistScreen" component={ChecklistScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ChecklistDetailScreen" component={ChecklistDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AddChecklistScreen" component={AddChecklistScreen} options={{ headerShown: false }} />


  </Stack.Navigator>

);


const GameStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="QuizScreen" component={QuizScreen} options={{ headerShown: false }} />
    <Stack.Screen name="QuizQuestionScreen" component={QuizQuestionScreen} options={{ headerShown: false }} />

  </Stack.Navigator>

);


const ProfileScreenStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BadgeScreen" component={BadgeScreen} options={{ headerShown: false }} />

  </Stack.Navigator>
);



const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4CAF50' }}
      contentContainerStyle={{ backgroundColor: '#4CAF50' }}
      text1Style={{ color: '#FFFFFF' }}
    />
  ),

  error: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#FF0000' }}
      contentContainerStyle={{ backgroundColor: '#FF0000' }}
      text1Style={{ color: '#FFFFFF' }}
      text2Style={{ color: '#FFFFFF' }}
    />
  ),


};



const lightTheme = {
  tabBarActiveTintColor: '#000000',
  tabBarInactiveTintColor: '#808080',
  tabBarBackgroundColor: '#FFFFFF'

};


const darkTheme = {
  tabBarActiveTintColor: '#FFFFFF',
  tabBarInactiveTintColor: '#808080',
  tabBarBackgroundColor: '#000000',
};


export default App;
