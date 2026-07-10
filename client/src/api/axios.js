import axios from "axios";


const api = axios.create({

baseURL:
"https://ai-saas-client.onrender.com/api",

headers:{
"Content-Type":"application/json"
}

});


export default api;
