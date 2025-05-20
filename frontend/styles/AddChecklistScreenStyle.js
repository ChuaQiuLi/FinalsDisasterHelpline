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

    
    dropdownContainer: {
        borderColor: '#ccc',
    },

    
    dropdown: {
        borderColor: '#ccc',
    },


    
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderRadius: 4,
        padding: 10,
        fontSize: 18,
        marginTop: 20,
        textAlignVertical: 'top',
    },


    addButton: {
        backgroundColor: '#5EAFA1',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20, 
    },

    
    addButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
    },





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

    
    dropdownContainer: {
        borderColor: '#ccc',
    },

    
    dropdown: {
        borderColor: '#ccc',
    },


    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        fontSize: 18,
        marginTop: 20,
        textAlignVertical: 'top',
        color: '#ffffff',

    },


    addButton: {
        backgroundColor: '#5EAFA1',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20, 
    },

    
    addButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
    },






});



export { lightStyles, darkStyles  };