import { StyleSheet } from 'react-native';


const lightStyles = StyleSheet.create({
    
    container: {
        flex: 1,
        padding: 20,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        
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
    
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000000',

    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        color: '#ffffff'
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff'
        
    },

    badgeImage: {
        width: 60, 
        height: 60,
        marginTop: 12,
        marginBottom: 12

    },

    badgeTitle: {
        color: '#ffffff'

    },

    badgeDescription: {
        color: '#ffffff'

    },


    badgeCriteria: {
        color: '#ffffff',
        marginBottom: 12

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