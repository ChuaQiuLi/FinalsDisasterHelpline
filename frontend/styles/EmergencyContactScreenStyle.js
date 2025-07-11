import { StyleSheet } from 'react-native';


const lightStyles = StyleSheet.create({
    container: {
        flex: 1
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 40

    },

    contactText: {
        fontSize: 16,
        marginLeft: 20,
        marginTop: 10

    },

    safetyGuidelineTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 25,
    },

    safetyGuidelineText: {
        fontSize: 16,
        marginLeft: 20,
        marginTop: 5

    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderRadius: 14,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
        marginLeft: 15,
        marginTop: 40,

    },

    searchInput: {
        fontSize: 16,
        padding: 0,
        height: 40,
        flex: 1,
    },

    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },

    noCountryText: {
        marginLeft: 20,
        fontSize: 14,
        marginTop: 10


    },

    searchTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 20

    },


    noContact: {
        marginBottom: 20,
    }


});


const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 20,
        marginTop: 40

    },

    contactText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: 20,
        marginTop: 10

    },

    safetyGuidelineTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 20,
        marginTop: 20,
    },

    safetyGuidelineText: {
        fontSize: 16,
        marginLeft: 20,
        marginTop: 5,
        color: '#FFFFFF',

    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderRadius: 14,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
        marginLeft: 15,
        marginTop: 40,

    },

    searchInput: {
        fontSize: 16,
        padding: 0,
        height: 40,
        flex: 1,
    },

    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },

    searchItem: {
        color: '#FFFFFF',

    },

    noCountryText: {
        marginLeft: 20,
        fontSize: 14,
        marginTop: 10,
        color: '#FFFFFF',
    },

    searchTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 20,
        color: '#FFFFFF',

    },

    
    noContact: {
        marginBottom: 20,
        color: '#FFFFFF',
    }

    

});

export { lightStyles, darkStyles  };