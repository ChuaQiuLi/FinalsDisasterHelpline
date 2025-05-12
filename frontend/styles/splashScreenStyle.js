import { StyleSheet } from 'react-native';

const lightStyles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', 
    },
    
    icon: {
        width: 450, 
        height: 450,
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
        width: 400, 
        height: 400,
    },

});


export { lightStyles, darkStyles };
