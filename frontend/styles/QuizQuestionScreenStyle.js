import { StyleSheet } from 'react-native';


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    quizTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 40,

    },


    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
        marginBottom: 20,  
  
    },

    question: {
        flex: 1,             
        fontSize: 18,
        fontWeight: 'bold',
        flexWrap: 'wrap',

    },

    questionCounter: {
        fontSize: 14,
        marginLeft: 10,
        // Prevents the text from shrinking
        flexShrink: 0,


    },

    answerContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10,
        marginTop: 10,

    },

    answerText: {
        marginLeft: 10,
        fontSize: 16, 
        flexShrink: 1, 
        flexWrap: 'wrap', 
        flex: 1,

    },
    
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',  
        padding: 10,
    },


    submitButton: {
        backgroundColor: '#5EAFA1',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100, 
        marginTop: 30,
        marginRight: 10
        
    },


    submitText: {
        fontSize: 18,
        color: '#FFFFFF',

    },

    nextButton: {
        backgroundColor: '#34C759',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120, 
        marginTop: 30,

    },


    nextText: {
        fontSize: 18,
        color: '#FFFFFF',

    },


    explanationContainer: {
        marginTop: 20,
        padding: 10, 
        borderRadius: 5,  
    },


    explanationHeader: {
        fontSize: 14,
        marginLeft: 10,
        marginTop: 10,
        fontWeight: 'bold',
        marginBottom: 10

    },


    explanationText: {
        fontSize: 14,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 10

    }



});




const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000000',
    },

    quizTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 10,
        marginBottom: 40,

    },


    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
        marginBottom: 20,  
  
    },

    question: {
        flex: 1,             
        fontSize: 18,
        fontWeight: 'bold',
        flexWrap: 'wrap',
        color: '#FFFFFF',
    },

    questionCounter: {
        fontSize: 14,
        marginLeft: 10,
        // Prevents the text from shrinking
        flexShrink: 0,
        color: '#FFFFFF',

    },

    answerContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10,
        marginTop: 10,

    },

    answerText: {
        marginLeft: 10,
        fontSize: 16, 
        flexShrink: 1, 
        flexWrap: 'wrap', 
        flex: 1,
        color: '#FFFFFF',
    },


    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',  
        padding: 10,
    },


    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100, 
        marginTop: 30,
        marginRight: 10

    },

    submitText: {
        fontSize: 18,
        color: '#FFFFFF',

    },


    nextButton: {
        backgroundColor: '#34C759',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120, 
        marginTop: 30,

    },


    nextText: {
        fontSize: 18,
        color: '#FFFFFF',

    },



    explanationContainer: {
        marginTop: 20,
        padding: 10, 
        borderRadius: 5,       
    },


    explanationHeader: {
        fontSize: 14,
        marginLeft: 10,
        marginTop: 10,
        fontWeight: 'bold',
        marginBottom: 10

    },


    explanationText: {
        fontSize: 14,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 10

    }

});



export { lightStyles, darkStyles  };