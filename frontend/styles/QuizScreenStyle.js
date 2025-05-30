import { StyleSheet } from 'react-native';


const lightStyles = StyleSheet.create({
        container: {
        flex: 1,
        padding: 20,

    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,  
        marginTop: 10,
    },
  
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,

    },

    listContainer: {
        flexDirection: 'column', 
        marginVertical: 5, 
    },

    quizTitle: {
        fontSize: 16, 
        fontWeight: 'bold',
        flexShrink: 1, 
        flexWrap: 'wrap', 
        flex: 1

    },


    quizDescription: {
        fontSize: 14, 
        flexShrink: 1, 
        flexWrap: 'wrap', 
        flex: 1

    },


    quizDifficulty:{
        fontSize: 14, 
        flexShrink: 1, 
        flexWrap: 'wrap', 
        flex: 1

    },

    questionsCount: {
        fontSize: 12, 
        flexShrink: 1, 
        flexWrap: 'wrap', 
        flex: 1

    },

    title: {
        fontSize: 18, 
        fontWeight: 'bold',
        marginTop: 20, 
        marginBottom: 8,

    },

    quizButton: {
        backgroundColor: '#34C759',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: 'center',
        alignSelf: 'flex-end',
        width: 80, 
        marginTop: 6,
        
    }



});


const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000000',

    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,  
        marginTop: 10,
    },
  
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        color: '#ffffff',

    },

    listContainer: {
        flexDirection: 'column', 
        marginVertical: 5, 
    },

    quizTitle: {
        fontSize: 16, 
        fontWeight: 'bold',
        flexShrink: 1, 
        flexWrap: 'wrap', 
        flex: 1,
        color: '#ffffff',

    },


    quizDescription: {
        fontSize: 14, 
        color: '#ffffff',
        flexShrink: 1, 
        flexWrap: 'wrap', 
        flex: 1,
      

    },


    quizDifficulty:{
        fontSize: 14, 
        flexShrink: 1, 
        flexWrap: 'wrap', 
        flex: 1,
        color: '#ffffff',

    },

    questionsCount: {
        fontSize: 12, 
        flexShrink: 1, 
        flexWrap: 'wrap', 
        flex: 1,
        color: '#ffffff',

    },


    startQuiz: {
        color: '#ffffff',

    },


    title: {
        fontSize: 18, 
        fontWeight: 'bold',
        marginTop: 20, 
        color: '#ffffff',
        marginBottom: 8,

    },

    quizButton: {
        backgroundColor: '#34C759',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: 'center',
        alignSelf: 'flex-end',
        width: 80, 
        marginTop: 10,
        
    }


});



export { lightStyles, darkStyles  };