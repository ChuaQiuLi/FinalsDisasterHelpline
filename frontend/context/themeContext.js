import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import API from '../api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const user = useSelector((state) => state.auth.user); 

  useEffect(() => {
    if (useSystemTheme) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, useSystemTheme]);


  useEffect(() => {
    if (user && user.id) {
      // Fetch user theme from the backend
      const fetchTheme = async () => {
        try {
          const response = await API.get(`/api/user/get-theme/${user.id}`);
          const fetchedTheme = response.data.theme;
          if (fetchedTheme === 'system') {
            setIsDarkMode(systemColorScheme === 'dark');
            setUseSystemTheme(true);
          } 
          
          else {
            setIsDarkMode(fetchedTheme === 'dark');
            setUseSystemTheme(false);
          }

        } 
        
        catch (error) {
          console.error('Failed to fetch theme:', error);
        }
      };

      fetchTheme();
    } 
    
    else if (useSystemTheme) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [user, systemColorScheme, useSystemTheme]);


  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setUseSystemTheme(false);
    setIsDarkMode(!isDarkMode);

    // Save theme preference to the backend
    const saveTheme = async () => {
      try {
        await API.post('/api/user/update-theme', { user_id: user.id, theme: newTheme });
      } 
      
      catch (error) {
        console.error('Failed to save theme:', error);
      }

    };

    saveTheme();

  };


  const value = {isDarkMode, useSystemTheme, toggleTheme, setUseSystemTheme};



  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};


export const useTheme = () => useContext(ThemeContext);
