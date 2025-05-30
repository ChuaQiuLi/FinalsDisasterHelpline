import React, { useState, useEffect } from 'react';
import { View, Text, TouchableHighlight, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { lightStyles, darkStyles } from '../styles/QuizQuestionScreenStyle.js';
import API from '../api';



const QuizQuestionScreen = ({ route }) => {
    const { isDarkMode } = useTheme(); 
    const styles = isDarkMode ? darkStyles : lightStyles; 
    const userId = useSelector((state) => state.auth.user?.id);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const { quizQuestion } = route.params;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [ansExplanation, setAnsExplanation] = useState(null); 

    // Gets the list of questions and answer that is passed from previous screen
    const questions = quizQuestion.quizQuestions;
    // Get the current question and answer based on the current index
    const currentQuestion = questions[currentIndex];


    const checkQuestion = async () => {

        // Prevent multiple requests if already loading
        if (loading) return;

        if (selectedAnswer === null) {
            Alert.alert('Select an answer for the question.');
            return;
        }

        // Set loading to true before starting the request
        setLoading(true);

        try {
            const response = await API.get('/api/quiz/check-answer', { params: { quiz_id: quizQuestion.quiz_id, question_id: currentQuestion.question_id, answer_id: selectedAnswer }});
            setAnsExplanation(response.data)

            if (response.data.is_correct) {
                // default to 0 if parse fails
                // 10 means represent the score in base 10 deciaml (whole number)
                const points = parseInt(currentQuestion.points, 10) || 0; 
                setScore((prevScore) => prevScore + points);
            }

        }

        catch (error) {
            if (error.response && error.response.status === 400) {
                Alert.alert('Invalid request', 'Please check your answer and try again.');
            }

            else if (error.response && error.response.status === 404) {
                Alert.alert('Not found', 'The answer or question was not found.');
            }

            else {
                Alert.alert('Error', 'Failed to check answer. Please try again later.');
                console.error(error);

            }

        }

        finally {
            // Add a delay before resetting loading state
            setTimeout(() => setLoading(false), 500);
        }
    
    };


    
    const nextQuestion = async () => {

        // Prevent going to next question if the current answer hasn't been checked
        if (!ansExplanation) {
            Alert.alert('Please submit your answer before going to the next question.');
            return;
        }

        if (currentIndex + 1 < questions.length) {
            // Move to the next question
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setSelectedAnswer(null);
            setAnsExplanation(null);
            return;
        }
        

        else {

            // Final question — save score
            setLoading(true);
            
            try {
                const response = await API.post('/api/quiz/save-score', { user_id: userId, quiz_id: quizQuestion.quiz_id, score: score });
                if (response.status === 200) {
                    Alert.alert('Quiz Completed', `Your score: ${score}/100`);
                    navigation.goBack();
                }
            }

            catch (error) {
                if (error.response && error.response.status === 400) {
                    Alert.alert('Invalid request', 'Please check your answer and try again.');
                }

                else {
                    Alert.alert('Error', 'Failed to check answer. Please try again later.');
                    console.error(error);

                }

            }

            finally {
                // Add a delay before resetting loading state
                setTimeout(() => setLoading(false), 500);

            }

        }


    };




    return (
        <SafeAreaView style={styles.container}>
      
            <Text style={styles.quizTitle}>{quizQuestion.quiz_title}</Text>

            <View style={styles.questionHeader}>
                <Text style={styles.question}>{currentQuestion.question}</Text>
                <Text style={styles.questionCounter}>Question {currentIndex + 1} of {questions.length}</Text>

            </View>


            {currentQuestion.quizAnswer.map((answer) => (
                <View key={answer.answer_id} style={styles.answerContainer}>       
                    <Checkbox value={selectedAnswer === answer.answer_id} onValueChange={() => setSelectedAnswer(answer.answer_id)} disabled={!!ansExplanation} />
                    <Text style={styles.answerText}>{answer.answer_text}</Text>

                </View>

            ))}

            {/* Show answer explanation after submission */}
            {ansExplanation && (
                // change the background colour of this container based to red or green based on user answer
                <View style={[styles.explanationContainer, { backgroundColor: ansExplanation.is_correct ? '#00FF00' : '#FF0000', },]}>
                    <Text style={styles.explanationHeader}>{ansExplanation.is_correct ? 'Correct!' : 'Incorrect'}</Text>
                    
                    {ansExplanation.answer_explanation ? (
                        <Text style={styles.explanationText}>{ansExplanation.answer_explanation}</Text>
                    ) : null}

                </View>

            )}


            <View style={styles.buttonContainer}>
                <TouchableHighlight style={styles.submitButton} onPress={checkQuestion} underlayColor={isDarkMode ? '#999999' : '#999999'} disabled={loading}>
                <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit'}</Text>
                </TouchableHighlight>


                <TouchableHighlight onPress={nextQuestion} style={styles.nextButton} underlayColor={isDarkMode ? '#999999' : '#999999'} disabled={loading && currentIndex + 1 === questions.length}>
                    <Text style={styles.nextText}>{loading && currentIndex + 1 === questions.length ? 'Saving score...' : 'Next'}</Text>
                </TouchableHighlight>
   

            </View>




        </SafeAreaView>

    );


};



export default QuizQuestionScreen;


