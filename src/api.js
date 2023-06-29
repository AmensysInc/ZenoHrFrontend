import axios from 'axios';

const baseURL = 'http://localhost:8082'; // Your API base URL

const instance = axios.create({
  baseURL: baseURL,
});

export default instance;