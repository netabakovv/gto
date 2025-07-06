import axios from "axios";

const API_PUBLIC = "http://localhost:8080/api/normatives";

// Получаем конфиг с заголовком авторизации
const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Токен авторизации не найден");
    }

    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// Публичные методы (не требуют авторизации)
export const getAllNormatives = () =>
    axios.get(API_PUBLIC);

export const getNormativeById = (id) =>
    axios.get(`${API_PUBLIC}/${id}`);

// Методы, требующие авторизации
export const createNormative = (normativeData) => {
    const config = getAuthConfig(); // Получаем весь конфиг, а не только headers
    return axios.post(API_PUBLIC, normativeData, config);
};

export const updateNormative = (id, normativeData) => {
    const config = getAuthConfig();
    return axios.put(`${API_PUBLIC}/${id}`, normativeData, config);
};

export const deleteNormative = (id) => {
    const config = getAuthConfig();
    return axios.delete(`${API_PUBLIC}/${id}`, config);
};