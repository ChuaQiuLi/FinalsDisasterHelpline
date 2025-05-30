import React, { useState, useEffect } from 'react';
import { View, Text, TouchableHighlight, SectionList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { lightStyles, darkStyles } from '../styles/QuizScreenStyle.js';
import API from '../api';


const QuizScreen= () => {
    const { isDarkMode } = useTheme(); 
    const styles = isDarkMode ? darkStyles : lightStyles; 
    const userId = useSelector((state) => state.auth.user?.id);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [sections, setSections] = useState([]);
    

    useEffect(() => {
        if (isFocused) {
            fetchQuizDetails(); 
        }
      
    }, [isFocused]);


    const fetchQuizDetails = async () => {
        try {
            const response = await API.get('/api/quiz/details', { params: { user_id: userId } });
            // Transform backend data into SectionList format
            const formatSections = response.data.map(disaster => ({
                title: disaster.disaster_name,
                data: (disaster.quiz || []).map(quiz => ({ ...quiz, quizResults: quiz.quizResults || [] }))

            }));

            setSections(formatSections);

        } 
        
        catch (error) {
            console.error('Error fetching quiz:', error);
            Alert.alert('Failed to fetch quiz. Please try again later.');
        }

    };


    const handlePress = (quizQuestion) => {
        navigation.navigate('QuizQuestionScreen', { quizQuestion });

    };


    // show score text colour based on user score range
    const getScoreColor = (score) => {
        // green
        if (score >= 80) return isDarkMode ? '#00FF00' : '#2E8B57'; 
        // orange
        if (score >= 50) return '#FFA500'; 
        // red
        return '#FF6347'; 
    
    };



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Disaster Quiz</Text>
            </View>
            
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.quiz_id.toString()}
                
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.title}>{title}</Text>

                )}

                renderItem={({ item }) => (
                    <View style={styles.listContainer}>
                        <Text style={styles.quizTitle}>{item.quiz_title}</Text>
                        <Text style={styles.quizDescription}>{item.quiz_description}</Text>
                        <Text style={styles.quizDifficulty}>Difficulty: {item.difficulty_level}</Text>
                        <Text style={styles.questionsCount}>Number of Questions: {item.quizQuestions ? item.quizQuestions.length : 0}</Text>
                        

                        {item.quizResults && item.quizResults.length > 0 && (
                            <Text style={{ color: getScoreColor(item.quizResults[0].score) }}>Your Score: {item.quizResults[0].score}/100</Text>
                        )}

                        <TouchableHighlight underlayColor={isDarkMode ? '#999999' : '#999999'} style={styles.quizButton}  onPress={() => handlePress(item)}>
                            <Text style={styles.startQuiz}>{item.quizResults && item.quizResults.length > 0 ? 'Retake Quiz' : 'Start Quiz'}</Text>
                        </TouchableHighlight>


                    </View>


                )}


            />
    
        </SafeAreaView>

    );
        

};



export default QuizScreen;