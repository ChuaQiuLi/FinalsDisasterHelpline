import axios from 'axios';

const API = axios.create({
    baseURL: 'http://192.168.50.181:3000',
});

export default API;