import { StyleSheet } from 'react-native';


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    }, 

    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 25,
        justifyContent: 'center',
        position: 'relative',
    },

    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },

    settingsIconContainer: {
        position: 'absolute',
        right: 15,
        padding: 5,
        borderRadius: 5,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
      
    
    inputContainer: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        height: 'auto',
        marginTop: 20,
        padding: 25,
        paddingBottom: 10,
        borderRadius: 12,
    },
    
    usernameLabel: {
        fontWeight: 'bold',
        fontSize: 18,
    },

    usernameInput: {
        fontSize: 16,
        marginBottom: 10,
        
    },

    emailLabel: {
        fontWeight: 'bold',
        fontSize: 18,
    },

    emailInput: {
        fontSize: 16,
        marginBottom: 10,
        
    },

    editProfileButton: {
        width: '80%',
        backgroundColor: '#20C997',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },

    editProfileButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },


    settingsIcon: {
        color: 'black'
    },

    badgeButton: {
        width: '80%',
        backgroundColor: '#6F42C1',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 25,
    },

    
    badgeText: {
        color: '#FFFFFF'

    }


});




const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#000000',
    },

    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 25,
        justifyContent: 'center',
        position: 'relative',
    },

    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },

    settingsIconContainer: {
        position: 'absolute',
        right: 15,
        padding: 5,
        borderRadius: 5,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',

    },

    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 100,
    },
    
    inputContainer: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        height: 'auto',
        marginTop: 20,
        padding: 25,
        paddingBottom: 10,
        borderRadius: 12,
    },
    
    usernameLabel: {
        fontWeight: 'bold',
        fontSize: 18,
    },

    usernameInput: {
        fontSize: 16,
        marginBottom: 10,
        
    },

    emailLabel: {
        fontWeight: 'bold',
        fontSize: 18,
    },

    emailInput: {
        fontSize: 16,
        marginBottom: 10,
        
    },

    editProfileButton: {
        width: '80%',
        backgroundColor: '#20C997',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },

    editProfileButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },


    settingsIcon: {
        color: '#FFFFFF'
    },

    badgeButton: {
        width: '80%',
        backgroundColor: '#6F42C1',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 25,
    },

    badgeText: {
        color: '#FFFFFF'

    }


});



export { lightStyles, darkStyles};