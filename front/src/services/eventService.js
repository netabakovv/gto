import axios from "axios";

const API_BASE = "http://localhost:8080/api";
const EVENTS_PUBLIC = `${API_BASE}/events`;

const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// Публичные методы
export const getAllEvents = async () => {
    const response = await axios.get(EVENTS_PUBLIC);
    return response;
};
// Получение назначенных судей для события
// Получение назначенных судей
export const fetchAssignedJudges = async (eventId) => {
    try {
        const response = await axios.get(`${API_BASE}/events/${eventId}/judges`, getAuthConfig());
        return { data: response.data || [] };
    } catch (err) {
        console.error("Ошибка при получении назначенных судей:", err);
        return { data: [] };
    }
};

// Назначение судей
export const assignJudgesToEvent = async (eventId, judgeIds) => {
    const response = await fetch(`http://localhost:8080/api/events/${eventId}/judges`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(judgeIds)
    });
    if (!response.ok) throw new Error("Ошибка назначения судей");
    return await response.json();
};
export const getFutureEvents = () => axios.get(`${EVENTS_PUBLIC}/future`);
export const registerOnEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    console.log('Токен из localStorage:', token); // Шаг 1: Проверяем наличие токена

    try {
        const response = await axios.post(
            `${EVENTS_PUBLIC}/${eventId}/register`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Без trim() для диагностики
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Детали ошибки:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        }); // Шаг 2: Логируем полную ошибку

        throw new Error(error.response?.data?.message || 'Ошибка регистрации');
    }
};

// Административные методы
export const createEvent = (eventData) =>
    axios.post(EVENTS_PUBLIC, eventData, getAuthConfig());

export const updateEvent = (id, eventData) =>
    axios.put(`${EVENTS_PUBLIC}/${id}`, eventData, getAuthConfig());

export const deleteEvent = (id) =>
    axios.delete(`${EVENTS_PUBLIC}/${id}`, getAuthConfig());