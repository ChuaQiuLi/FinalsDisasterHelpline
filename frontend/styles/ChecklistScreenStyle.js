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
    }



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
    }
  


});



export { lightStyles, darkStyles  };