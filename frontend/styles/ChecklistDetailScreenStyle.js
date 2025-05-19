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
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,

    },

    checklistItem: {
        marginLeft: 10,
        fontSize: 16, 


    },

    title: {
        fontSize: 18, 
        fontWeight: 'bold',
        marginTop: 20, 
        marginBottom: 10,

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
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        color: '#ffffff',

    },

    checklistItem: {
        color: '#ffffff',
        marginLeft: 10,
        fontSize: 16, 


    },

    title: {
        fontSize: 18, 
        fontWeight: 'bold',
        marginTop: 20, 
        color: '#ffffff',
        marginBottom: 10,

    }


});



export { lightStyles, darkStyles  };