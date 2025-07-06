import axios from "axios";

const API = "http://localhost:8080/api/profile";

export const getProfile = async (token) => {
    try {
        const response = await axios.get(API, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching profile data:', error);
        throw error;
    }
}

export const updateProfile = async (token, profileData) => {
    try {
        const response = await axios.put(API, profileData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

export const getProgress = async (token, userId, year) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/results/user/${userId}/${year}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching progress data:', error);
        throw error;
    }
};

// Получение пользователей по роли
export const getJudges = async () => {
    try {
    const response = await fetch(`http://localhost:8080/api/profile/judges`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return { data: response.data || [] }; // Гарантируем возврат объекта с data
} catch (err) {
        console.error("Ошибка при получении судей:", err);
        return {data: []}; // Возвращаем пустой массив при ошибке
    }
}

export const getAvailableYears = async (token) => {
    try {
        const response = await axios.get(`${API}/years`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching available years:', error);
        throw error;
    }
};