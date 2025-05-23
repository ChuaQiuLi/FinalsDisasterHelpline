import React, { useState, useEffect } from 'react';
import { View, Text, TouchableHighlight, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { lightStyles, darkStyles } from '../styles/AddChecklistScreenStyle.js';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import API from '../api';


// Import components
import BackButton from '../components/BackButton';


const AddChecklistScreen = ({ route }) => {
    const { isDarkMode } = useTheme();
    const styles = isDarkMode ? darkStyles : lightStyles;
    const userId = useSelector((state) => state.auth.user?.id);
    const navigation = useNavigation();
    const { disaster_id, disaster_name } = route.params;
    // controls the dropdown visibility
    const [open, setOpen] = useState(false);
    // stores the selected item 
    const [select, setSelectedItem] = useState(null);
    // store the list of titles
    const [items, setItems] = useState([]);
    const [checklistText, setChecklistText] = useState('');
    const [loading, setLoading] = useState(false); 

    
    const previousPage = () => {
        navigation.goBack();
    }


    useEffect(() => {
        fetchChecklistTitle(); 

    }, [disaster_id]);
    


    const fetchChecklistTitle = async () => {
        try {
            const response = await API.get('/api/checklist/title', { params: { disaster_id: disaster_id }});
            const titles = response.data;

            // Convert to format required by DropDownPicker
            const formattedItems = titles.map(item => ({
                label: item.title,
                value: item.title_id

            }));

            setItems(formattedItems);

        }

        catch (error) {
            console.error('Error fetching checklist title:', error);
            Alert.alert('Failed to fetch checklist title. Please try again later.');
        }

    };


    
    const handleSave = async () => {

        // Prevent multiple requests if already loading
        if (loading) return;
        
        // Check if drop down is selected and whether there is checklist item
        if (!select || !checklistText.trim()) {
            Alert.alert('Error', 'Please select a checklist title and write a checklist item.');
            return;
        }

        // Set loading to true before starting the request
        setLoading(true);

        try {

            const response = await API.post('/api/checklist/add-checklist-item', { user_id: userId, disaster_id: disaster_id,  title_id: select, checklist_item: checklistText });

            if (response.status === 200) {
                Toast.show({ type: 'success', position: 'bottom', text1: 'Checklist item saved successfully', visibilityTime: 2000, autoHide: true, bottomOffset: 60, });
                // Go back to checklist screen
                navigation.navigate('ChecklistScreen');

            }

        }

        catch (error) {
            console.error('Error saving checklist item:', error);
            Alert.alert('Error', 'Failed to save checklist item. Please try again later.');

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
            <View style={styles.headerContainer}>
                <BackButton onPress={previousPage} /> 
                <Text style={styles.header}>Add Disaster Checklist Item For {disaster_name}</Text>
            </View>
            
            <DropDownPicker
            open={open}
            value={select}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedItem}
            setItems={setItems}
            placeholder="Select a checklist title"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            />

            <TextInput multiline value={checklistText} onChangeText={setChecklistText} style={styles.textInput} placeholder="write checklist item..." placeholderTextColor={isDarkMode ? '#FFFFFF' : '#888888'} />
            
            <TouchableHighlight style={styles.addButton} onPress={handleSave} underlayColor={isDarkMode ? '#999999' : '#999999'}  disabled={loading}>
                <Text style={styles.addButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
            </TouchableHighlight>
      

        </SafeAreaView>


    );


};




export default AddChecklistScreen;