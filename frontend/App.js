import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Toast, {BaseToast} from 'react-native-toast-message'; 
import { useDispatch, Provider, useSelector } from 'react-redux';
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




// Create a tab navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const AppContent = () => {
  const { isDarkMode, useSystemTheme } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
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

          case 'Emergency Contact':
            iconName = focused ? 'call' : 'call-outline';
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

    <Tab.Screen name="Emergency Contact" component={EmergencyContactScreen} />


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



// // Profile stack navigator
// const ProfileScreenStack = () => (
//   <Stack.Navigator>

//   </Stack.Navigator>
// );



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
