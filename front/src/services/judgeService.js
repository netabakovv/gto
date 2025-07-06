import axios from "axios";

const API = "http://localhost:8080/api/judge";

export const getMyEvents = () => axios.get(`${API}/my-events`);
export const submitResult = (eventId, resultData) =>
    axios.post(`${API}/${eventId}/submit-result`, resultData);
