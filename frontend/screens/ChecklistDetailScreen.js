import React, { useState, useEffect } from 'react';
import { View, Text, TouchableHighlight, SectionList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { lightStyles, darkStyles } from '../styles/ChecklistDetailScreenStyle';
import Checkbox from 'expo-checkbox';
import Toast from 'react-native-toast-message';
import API from '../api';


// Import components
import BackButton from '../components/BackButton';


const ChecklistDetailScreen = ({ route }) => {
    const { isDarkMode } = useTheme();
    const styles = isDarkMode ? darkStyles : lightStyles;
    const userId = useSelector((state) => state.auth.user?.id);
    const navigation = useNavigation();
    const { checklist } = route.params;
    const [checkedItems, setCheckedItems] = useState({});
    const [sections, setSections] = useState([]);


    const previousPage = () => {
        navigation.goBack();
    }


    // Initialize sections from checklist
    useEffect(() => {
        if (checklist && checklist.title) {
            const initialSections = checklist.title.map((section) => ({
                title: section.title,
                data: [
                    ...(section.templates || []).map(item => ({
                        id: `template-${item.template_id}`,
                        label: item.checklist_item
                    })),

                    ...(section.checklists || []).map(item => ({
                        id: `checklist-${item.checklist_id}`,
                        label: item.checklist_item
                    }))
                ]

            }));

            setSections(initialSections);
        }

    }, [checklist]);



    // Fetch existing checklist status 
    useEffect(() => {
        const fetchChecklistStatus = async () => {
            try {
                const checklistResponse = await API.get('/api/checklist/user-checklist-status', { params: { user_id: userId } });
                const templateResponse = await API.get('/api/checklist/template-checklist-status', { params: { user_id: userId } });

                const checklistStatus = checklistResponse.data;
                const templateStatus = templateResponse.data;

                const initialChecked = {};

                // template id will be format as: template-id
                checklistStatus.forEach(item => {
                    initialChecked[`checklist-${item.checklist_id}`] = item.is_checked;
                });

                templateStatus.forEach(item => {
                    initialChecked[`template-${item.template_id}`] = item.is_checked;
                });


                setCheckedItems(initialChecked);

            }

            catch (error) {
                console.error('Failed to fetch checklist status:', error);
            }
        };

        fetchChecklistStatus();

    }, [userId]);



    const toggleCheckbox = async (itemId, isChecked) => {

        // update the UI
        setCheckedItems(prev => ({ ...prev, [itemId]: isChecked }));

        // e.g. 'template-1'
        const [type, id] = itemId.split('-');

        try {
            if (type === 'template') {
                await API.post('/api/checklist/change-template-checklist-status', { user_id: userId, template_id: id, is_checked: isChecked });
            }

            else if (type === 'checklist') {
                await API.post('/api/checklist/change-user-checklist-status', { user_id: userId, checklist_id: id, is_checked: isChecked });

            }
        }

        catch (error) {
            console.error('Failed to update checklist status:', error);
            // revert the UI state if the API call fails
            setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));

        }

    };



    const handleLongPress = (item) => {

        const [type, id] = item.id.split('-');

        // Only allow delete if user created the checklist item
        if (type === 'checklist') {
            Alert.alert('Delete Checklist Item', 'Do you want to delete this checklist item?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteChecklistItem(id), },
            ]

            );

        }

    };


    const deleteChecklistItem = async (checklist_id) => {

        try {
            const response = await API.delete('/api/checklist/delete-user-checklist-item', { params: { checklist_id: checklist_id, user_id: userId } });

            if (response.status === 200) {
                // Successfully deleted
                Toast.show({ type: 'success', position: 'bottom', text1: 'Checklist item deleted successfully', visibilityTime: 2000, autoHide: true, bottomOffset: 60, });

                // Remove item from UI
                setCheckedItems(prev => {
                    const updated = { ...prev };
                    delete updated[`checklist-${checklist_id}`];
                    return updated;
                });

                // Remove from sections state
                const updatedSections = sections.map(section => ({
                    ...section,
                    data: section.data.filter(item => item.id !== `checklist-${checklist_id}`)

                }));

                setSections(updatedSections);

            }

            else {
                // Handle other status codes or errors
                Alert.alert('Error', 'Failed to delete checklist item');

            }

        }

        catch (error) {
            console.error('Failed to delete checklist item:', error);
            Alert.alert('Error', 'Failed to delete checklist item. Please try again later.');
        }

    };



    const handleAddPress = () => {
        navigation.navigate('AddChecklistScreen', { disaster_id: checklist.disaster_id, disaster_name: checklist.disaster_name });

    };



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <BackButton onPress={previousPage} />
                <Text style={styles.header}>Disaster Checklist For {checklist.disaster_name}</Text>
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.title}>{title}</Text>

                )}

                renderItem={({ item }) => (
                    <View style={styles.listContainer}>
                        <Checkbox value={checkedItems[item.id]} onValueChange={(isChecked) => toggleCheckbox(item.id, isChecked)} />
                        <TouchableHighlight underlayColor={isDarkMode ? '#999999' : '#999999'} onLongPress={() => handleLongPress(item)}>
                            <Text style={styles.checklistItem}>{item.label}</Text>
                        </TouchableHighlight>

                    </View>

                )}


            />

            <TouchableHighlight underlayColor={isDarkMode ? '#999999' : '#999999'} style={styles.fab} onPress={handleAddPress}>
                <Ionicons name="add" size={32} color="black" />
            </TouchableHighlight>


        </SafeAreaView>

    );


};



export default ChecklistDetailScreen;