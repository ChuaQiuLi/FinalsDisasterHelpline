import { StyleSheet } from 'react-native';


const lightStyles = StyleSheet.create({
    list: {
        flex: 1,
        paddingTop: 15,
    },

    titleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10
    },

  
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },

    
    content: {
        fontSize: 16,
    },

    noDisasterText: {
        textAlign: 'center',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },




});


const darkStyles = StyleSheet.create({
    list: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#000000',
    },

    titleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },

    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },

    content: {
        fontSize: 16,
        color: '#ffffff',
    },


    noDisasterText: {
       textAlign: 'center',
       color: '#ffffff',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#FFFFFF',

    },
  


});



export { lightStyles, darkStyles  };