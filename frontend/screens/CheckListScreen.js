import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { lightStyles, darkStyles } from '../styles/ChecklistScreenStyle';
import API from '../api';


const ChecklistScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = isDarkMode ? darkStyles : lightStyles;
  const userId = useSelector((state) => state.auth.user?.id);
  const navigation = useNavigation();
  const [disaster, setDisaster] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchDisasterChecklist();

  }, []);


  const fetchDisasterChecklist = async () => {
    setLoading(true);

    try {
      const response = await API.get('/api/checklist/details', { params: { user_id: userId } });
      setDisaster(response.data);

    }

    catch (error) {
      console.error('Error fetching checklist:', error);
      Alert.alert('Failed to fetch checklist. Please try again later.');
    }

    finally {
      setLoading(false);
    }

  };


  const handlePress = (checklist) => {
    navigation.navigate('ChecklistDetailScreen', { checklist });

  };



  const renderItem = ({ item }) => (
    <TouchableHighlight underlayColor={isDarkMode ? '#999999' : '#999999'} onPress={() => handlePress(item)}>
      <View style={styles.item}>
        <Text style={styles.content}>{item.disaster_name}</Text>
      </View>
    </TouchableHighlight>

  );


  if (loading) {
    return (

      <SafeAreaView style={styles.list}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Disaster Checklist</Text>
        </View>

        <View style={{ padding: 20 }}>
          <Text>Loading...</Text>
        </View>

      </SafeAreaView>
      
    );


  }




  if (disaster.length === 0) {
    return (
      <SafeAreaView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Disaster Checklist</Text>
        </View>

        <View>
          <Text style={styles.noDisasterText}>No disaster checklist found</Text>
        </View>

      </SafeAreaView>


    );
  }



  return (
    <SafeAreaView style={styles.list}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Disaster Checklist</Text>
      </View>

      <FlatList
        data={disaster}
        renderItem={renderItem}
        keyExtractor={(item) => item.disaster_id.toString()}
      />

    </SafeAreaView>


  );

};



export default ChecklistScreen;