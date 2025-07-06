import { useEffect, useState } from 'react';
import { getAvailableYears, getProgress } from '../services/userService';

export default function ProgressStats({ userId }) {
    const [year, setYear] = useState(new Date().getFullYear());
    const [progress, setProgress] = useState(null);
    const [availableYears, setAvailableYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Токен авторизации не найден');
                }

                // Получаем годы, в которых есть результаты
                const years = await getAvailableYears(token, userId);
                setAvailableYears(years);

                // Получаем прогресс для выбранного года
                const progressData = await getProgress(token, userId, year);
                setProgress(progressData);
            } catch (err) {
                console.error("Failed to fetch progress data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year, userId]);

    const renderProgressBar = (value, color, label) => {
        if (!value) return null;

        const [current, total] = value.split('/').map(Number);
        const percentage = total > 0 ? (current / total) * 100 : 0;

        return (
            <div className="flex items-center">
                <div className="w-24 text-gray-600">{label}:</div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${color}`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{value}</div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="p-6 text-center">Загрузка...</div>;
    if (error) return <div className="p-6 text-red-500">Ошибка: {error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Прогресс по нормативам</h3>
                <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="px-3 py-1 border rounded-lg"
                    disabled={loading}
                >
                    {availableYears.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            {progress && (
                <div className="space-y-3">
                    {renderProgressBar(progress.GOLD, 'bg-yellow-500', 'Золото')}
                    {renderProgressBar(progress.SILVER, 'bg-gray-400', 'Серебро')}
                    {renderProgressBar(progress.BRONZE, 'bg-amber-700', 'Бронза')}
                </div>
            )}
        </div>
    );
}