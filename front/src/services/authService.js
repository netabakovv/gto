import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const register = async (data) => {
    try {
        const response = await axios.post(`${API}/register`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Передаём всю информацию об ошибке для обработки в компоненте
            throw {
                response: {
                    status: error.response.status,
                    data: error.response.data
                }
            };
        }
        throw error;
    }
};

export const login = async (data) => {
    const response = await axios.post(`${API}/login`, data);
    const token = response.data.token;
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return response.data;
};

