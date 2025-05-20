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
        flexDirection: 'row', 
        alignItems: 'center', 
        marginVertical: 5, 
    },

    checklistItem: {
        marginLeft: 10,
        fontSize: 16, 
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

    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        right: 20,
        bottom: 20,
        backgroundColor: '#FFE4A1',
        borderRadius: 28,
        elevation: 8,
        justifyContent: 'center', 
        alignItems: 'center', 
    
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

    listContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginVertical: 5, 
    },

    checklistItem: {
        color: '#ffffff',
        marginLeft: 10,
        fontSize: 16, 
        flexShrink: 1, 
        flexWrap: 'wrap', 
        flex: 1

    },

    title: {
        fontSize: 18, 
        fontWeight: 'bold',
        marginTop: 20, 
        color: '#ffffff',
        marginBottom: 8,

    },

    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        right: 20,
        bottom: 20,
        backgroundColor: '#FFE4A1',
        borderRadius: 28,
        elevation: 8,
        justifyContent: 'center', 
        alignItems: 'center', 
    
  },


});



export { lightStyles, darkStyles  };