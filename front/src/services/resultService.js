import axios from "axios";

const API = "http://localhost:8080/api/results";

export const getUserResults = (userId) =>
    axios.get(`${API}/user/${userId}`);
