import { StyleSheet } from 'react-native';

const lightStyles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', 
    },
    
    icon: {
        width: 420,
        height: 280,
        marginBottom: 10,
    },

    
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    
    icon: {
        width: 420,
        height: 280,
        marginBottom: 10,
    },

});


export { lightStyles, darkStyles };
