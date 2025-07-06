import React, { useState, useEffect, useContext } from "react";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  getAllNormatives,
  getNormativeById,
  createNormative,
  updateNormative,
  deleteNormative
} from "../services/normativeService";
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchAssignedJudges,
  assignJudgesToEvent
} from "../services/eventService";
import axios from "axios";
import {getJudges} from "../services/userService";

function AdminPage() {
  const [activeTab, setActiveTab] = useState("norms");
  const { api } = useContext(AuthContext);

  return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Панель администратора</h2>

        <div className="mb-6 flex">
          <button
              className={`px-4 py-2 rounded-tl-lg rounded-bl-lg ${
                  activeTab === 'norms' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('norms')}
          >
            Нормативы
          </button>
          <button
              className={`px-4 py-2 ${
                  activeTab === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('events')}
          >
            Мероприятия
          </button>
          <button
              className={`px-4 py-2 rounded-r-lg ${
                  activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('users')}
          >
            Пользователи
          </button>
        </div>

        {activeTab === 'norms' && <NormsTab api={api} />}
        {activeTab === 'events' && <EventsTab api={api} />}
        {activeTab === 'users' && <UsersTab api={api} />}
      </div>
  );
}


// Константы для типов и возрастных групп
const NORM_TYPES = {
  RUNNING: "Бег",
  SWIMMING: "Плавание",
  GYMNASTICS: "Гимнастика"
};

const AGE_GROUPS = {
  GROUP_13_15: "13-15 лет",
  GROUP_16_18: "16-18 лет",
  GROUP_19_25: "19-25 лет"
};

const GENDERS = {
  MALE: "Мужской",
  FEMALE: "Женский"
};

const MEASUREMENT_TYPES = {
  LESS_IS_BETTER: "Меньше лучше", // время
  MORE_IS_BETTER: "Больше лучше"
};

function NormsTab() {
  const [norms, setNorms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [IsEventModalOpen, setIsEventModalOpen] = useState(false);
  const [currentNorm, setCurrentNorm] = useState({
    name: "",
    description: "",
    type: "RUNNING",
    ageGroup: "GROUP_13_15",
    gender: "MALE",
    unit: "",
    bronzeStandard: "",
    silverStandard: "",
    goldStandard: "",
    measurementType: "LESS_IS_BETTER"
  });

  // Загрузка нормативов
  useEffect(() => {
    const fetchNorms = async () => {
      try {
        setLoading(true);
        const response = await getAllNormatives();
        setNorms(response.data);
      } catch (err) {
        setError("Не удалось загрузить нормативы");
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNorms();
  }, []);

  // Открытие модального окна
  const openModal = (norm = null) => {
    setCurrentNorm(norm || {
      name: "",
      description: "",
      type: "RUNNING",
      ageGroup: "GROUP_13_15",
      gender: "MALE",
      unit: "",
      bronzeStandard: "",
      silverStandard: "",
      goldStandard: "",
      measurementType: "LESS_IS_BETTER"
    });
    setIsEventModalOpen(true);
    setError(null);
  };

  // Сохранение норматива
  const handleSaveNorm = async () => {
    try {
      // Валидация
      if (!currentNorm.name || !currentNorm.unit ||
          !currentNorm.bronzeStandard || !currentNorm.silverStandard || !currentNorm.goldStandard) {
        throw new Error("Заполните все обязательные поля");
      }

      const normData = {
        name: currentNorm.name,
        description: currentNorm.description,
        type: currentNorm.type,
        ageGroup: currentNorm.ageGroup,
        gender: currentNorm.gender,
        unit: currentNorm.unit,
        bronzeStandard: currentNorm.bronzeStandard,
        silverStandard: currentNorm.silverStandard,
        goldStandard: currentNorm.goldStandard,
        measurementType: currentNorm.measurementType
      };

      let response;
      if (currentNorm.id) {
        // Редактирование
        response = await updateNormative(currentNorm.id, normData);
        setNorms(norms.map(n => n.id === currentNorm.id ? response.data : n));
      } else {
        // Создание
        response = await createNormative(normData);
        setNorms([...norms, response.data]);
      }

      setIsEventModalOpen(false);
    } catch (err) {
      setError(err.message || "Ошибка при сохранении норматива");
      console.error("Ошибка:", err);
    }
  };

  // Удаление норматива
  const handleDeleteNorm = async (id) => {
    if (window.confirm("Вы действительно хотите удалить этот норматив?")) {
      try {
        await deleteNormative(id);
        setNorms(norms.filter(n => n.id !== id));
      } catch (err) {
        setError("Ошибка при удалении норматива");
        console.error("Ошибка:", err);
      }
    }
  };

  // Обработка изменений в форме
  const handleNormChange = (e) => {
    const { name, value } = e.target;
    setCurrentNorm(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="text-center py-4">Загрузка...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Управление нормативами</h2>
          <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Добавить норматив
          </button>
        </div>

        {/* Таблица нормативов */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-left">Название</th>
              <th className="py-3 px-4 border-b text-left">Тип</th>
              <th className="py-3 px-4 border-b text-left">Возраст</th>
              <th className="py-3 px-4 border-b text-left">Пол</th>
              <th className="py-3 px-4 border-b text-left">Нормативы</th>
              <th className="py-3 px-4 border-b text-left">Действия</th>
            </tr>
            </thead>
            <tbody>
            {norms.map(norm => (
                <tr key={norm.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    <div className="font-medium">{norm.name}</div>
                    <div className="text-sm text-gray-600">{norm.description}</div>
                  </td>
                  <td className="py-3 px-4 border-b">{NORM_TYPES[norm.type] || norm.type}</td>
                  <td className="py-3 px-4 border-b">{AGE_GROUPS[norm.ageGroup] || norm.ageGroup}</td>
                  <td className="py-3 px-4 border-b">{GENDERS[norm.gender] || norm.gender}</td>
                  <td className="py-3 px-4 border-b">
                    <div>Золото: {norm.goldStandard} {norm.unit}</div>
                    <div>Серебро: {norm.silverStandard} {norm.unit}</div>
                    <div>Бронза: {norm.bronzeStandard} {norm.unit}</div>
                  </td>
                  <td className="py-3 px-4 border-b space-x-2">
                    <button
                        onClick={() => openModal(norm)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                      Редактировать
                    </button>
                    <button
                        onClick={() => handleDeleteNorm(norm.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Модальное окно */}
        {IsEventModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">
                    {currentNorm.id ? "Редактирование" : "Создание"} норматива
                  </h3>

                  {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                        {error}
                      </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 mb-1">Название*</label>
                        <input
                            type="text"
                            name="name"
                            value={currentNorm.name}
                            onChange={handleNormChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">Описание</label>
                        <textarea
                            name="description"
                            value={currentNorm.description}
                            onChange={handleNormChange}
                            className="w-full px-3 py-2 border rounded"
                            rows="3"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">Тип*</label>
                        <select
                            name="type"
                            value={currentNorm.type}
                            onChange={handleNormChange}
                            className="w-full px-3 py-2 border rounded"
                        >
                          {Object.entries(NORM_TYPES).map(([key, value]) => (
                              <option key={key} value={key}>{value}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">Возрастная группа*</label>
                        <select
                            name="ageGroup"
                            value={currentNorm.ageGroup}
                            onChange={handleNormChange}
                            className="w-full px-3 py-2 border rounded"
                        >
                          {Object.entries(AGE_GROUPS).map(([key, value]) => (
                              <option key={key} value={key}>{value}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 mb-1">Пол*</label>
                        <select
                            name="gender"
                            value={currentNorm.gender}
                            onChange={handleNormChange}
                            className="w-full px-3 py-2 border rounded"
                        >
                          {Object.entries(GENDERS).map(([key, value]) => (
                              <option key={key} value={key}>{value}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">Тип измерения*</label>
                        <select
                            name="measurementType"
                            value={currentNorm.measurementType}
                            onChange={handleNormChange}
                            className="w-full px-3 py-2 border rounded"
                        >
                          {Object.entries(MEASUREMENT_TYPES).map(([key, value]) => (
                              <option key={key} value={key}>{value}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">Единица измерения*</label>
                        <input
                            type="text"
                            name="unit"
                            value={currentNorm.unit}
                            onChange={handleNormChange}
                            className="w-full px-3 py-2 border rounded"
                            placeholder="сек, м, раз и т.д."
                            required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-gray-700 mb-1">Золото*</label>
                          <input
                              type="text"
                              name="goldStandard"
                              value={currentNorm.goldStandard}
                              onChange={handleNormChange}
                              className="w-full px-3 py-2 border rounded"
                              required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">Серебро*</label>
                          <input
                              type="text"
                              name="silverStandard"
                              value={currentNorm.silverStandard}
                              onChange={handleNormChange}
                              className="w-full px-3 py-2 border rounded"
                              required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">Бронза*</label>
                          <input
                              type="text"
                              name="bronzeStandard"
                              value={currentNorm.bronzeStandard}
                              onChange={handleNormChange}
                              className="w-full px-3 py-2 border rounded"
                              required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                      onClick={() => setIsEventModalOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                  >
                    Отмена
                  </button>
                  <button
                      onClick={handleSaveNorm}
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

// Вкладка для управления мероприятиями


// Константы для статусов событий
const EVENT_STATUSES = {
  UPCOMING: "Предстоящее",
  IN_PROGRESS: "В процессе",
  COMPLETED: "Завершено",
  CANCELED: "Отменено"
};

function EventsTab() {
  // Состояния
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAssignJudgeModalOpen, setIsAssignJudgeModalOpen] = useState(false);
  const [judges, setJudges] = useState([]);
  const [selectedJudges, setSelectedJudges] = useState([]);
  const [isJudgesLoading, setIsJudgesLoading] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    name: "", description: "", eventDate: "", location: "",
    status: "UPCOMING", registrationEnd: ""
  });
  const [eventForJudges, setEventForJudges] = useState(null);
  const [assignedJudges, setAssignedJudges] = useState([]);

  const API_BASE = "http://localhost:8080/api";

  const getAuthConfig = () => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  // Загрузка событий
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/events`, getAuthConfig());
        setEvents(response.data);
      } catch (err) {
        setError("Не удалось загрузить события");
        console.error("Ошибка:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Открытие модального окна назначения судей
  const openAssignJudgeModal = async (event) => {
    if (!event?.id) {
      setError("Не выбрано событие");
      return;
    }

    setEventForJudges(event);
    setIsAssignJudgeModalOpen(true);
    setError(null);
    setIsJudgesLoading(true);

    try {
      // Загрузка всех судей и уже назначенных на событие
      const [allJudgesRes, assignedJudgesRes] = await Promise.all([
        axios.get(`${API_BASE}/profile/judges`, getAuthConfig()),
        axios.get(`${API_BASE}/events/${event.id}/judges`, getAuthConfig())
      ]);

      const allJudges = allJudgesRes.data || [];
      const assigned = assignedJudgesRes.data || [];

      // Фильтруем судей - оставляем только тех, кто еще не назначен на это событие
      const availableJudges = allJudges.filter(judge =>
          !assigned.some(assignedJudge => assignedJudge.id === judge.id)
      );

      setJudges(availableJudges);
      setAssignedJudges(assigned);
      setSelectedJudges([]);
    } catch (err) {
      setError("Ошибка загрузки судей");
      console.error("Ошибка:", err);
    } finally {
      setIsJudgesLoading(false);
    }
  };

  // Назначение судей
  const handleAssignJudges = async () => {
    if (!eventForJudges?.id || selectedJudges.length === 0) return;

    try {
      await axios.post(
          `${API_BASE}/events/${eventForJudges.id}/judges`,
          selectedJudges,
          getAuthConfig()
      );

      // Обновляем список событий
      const response = await axios.get(`${API_BASE}/events`, getAuthConfig());
      setEvents(response.data);
      setIsAssignJudgeModalOpen(false);
    } catch (err) {
      setError("Ошибка при назначении судей");
      console.error("Ошибка:", err);
    }
  };
  // Выбор/отмена выбора судьи
  const handleJudgeSelection = (judgeId) => {
    setSelectedJudges(prev =>
        prev.includes(judgeId)
            ? prev.filter(id => id !== judgeId)
            : [...prev, judgeId]
    );
  };

  // Открытие модального окна редактирования события
  const openModal = (event = null) => {
    setCurrentEvent(event || {
      name: "",
      description: "",
      eventDate: "",
      location: "",
      status: "UPCOMING",
      registrationEnd: ""
    });
    setIsEventModalOpen(true);
    setError(null);
  };

  // Сохранение события
  const handleSaveEvent = async () => {
    try {
      // Валидация обязательных полей
      if (!currentEvent.name || !currentEvent.eventDate || !currentEvent.location) {
        throw new Error("Заполните все обязательные поля");
      }

      const eventData = {
        name: currentEvent.name,
        description: currentEvent.description,
        eventDate: currentEvent.eventDate,
        location: currentEvent.location,
        status: currentEvent.status,
        registrationEnd: currentEvent.registrationEnd
      };

      // Обновление или создание события
      let response;
      if (currentEvent.id) {
        response = await updateEvent(currentEvent.id, eventData);
        setEvents(events.map(e => e.id === currentEvent.id ? response.data : e));
      } else {
        response = await createEvent(eventData);
        setEvents([...events, response.data]);
      }

      setIsEventModalOpen(false);
    } catch (err) {
      setError(err.message || "Ошибка при сохранении события");
      console.error("Ошибка:", err);
    }
  };

  // Удаление события
  const handleDeleteEvent = async (id) => {
    if (window.confirm("Вы действительно хотите удалить это событие?")) {
      try {
        await deleteEvent(id);
        setEvents(events.filter(e => e.id !== id));
      } catch (err) {
        setError("Ошибка при удалении события");
        console.error("Ошибка:", err);
      }
    }
  };

  // Обработчик изменений в форме
  const handleEventChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentEvent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) return <div className="text-center py-4">Загрузка событий...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
      <div className="p-4">
        {/* Заголовок и кнопка добавления */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Управление событиями</h2>
          <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Добавить событие
          </button>
        </div>

        {/* Таблица событий */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-left">Название</th>
              <th className="py-3 px-4 border-b text-left">Дата</th>
              <th className="py-3 px-4 border-b text-left">Место</th>
              <th className="py-3 px-4 border-b text-left">Статус</th>
              <th className="py-3 px-4 border-b text-left">Регистрация до</th>
              <th className="py-3 px-4 border-b text-left">Участников</th>
              <th className="py-3 px-4 border-b text-left">Действия</th>
            </tr>
            </thead>
            <tbody>
            {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    <div className="font-medium">{event.name}</div>
                    <div className="text-sm text-gray-600">{event.description}</div>
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(event.eventDate).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="py-3 px-4 border-b">{event.location}</td>
                  <td className="py-3 px-4 border-b">
                    {EVENT_STATUSES[event.status] || event.status}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {event.registrationEnd}
                  </td>
                  <td className="py-3 px-4 border-b">{event.registeredCount || 0}</td>
                  <td className="py-3 px-4 border-b space-x-2">
                    <button
                        onClick={() => openModal(event)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                      Редактировать
                    </button>
                    <button
                        onClick={() => openAssignJudgeModal(event)}
                        className="text-green-600 hover:text-green-800"
                    >
                      Назначить судей
                    </button>
                    <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Модальное окно назначения судей */}
        {isAssignJudgeModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">
                    Назначить судей для {eventForJudges?.name}
                  </h3>

                  {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                        {error}
                      </div>
                  )}

                  {/* Показываем уже назначенных судей */}
                  {assignedJudges.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Уже назначены:</h4>
                        <ul className="space-y-1">
                          {assignedJudges.map(judge => (
                              <li key={judge.id} className="text-gray-600">
                                {judge.lastName} {judge.firstName} ({judge.email})
                              </li>
                          ))}
                        </ul>
                      </div>
                  )}

                  {/* Список доступных судей */}
                  {isJudgesLoading ? (
                      <div className="text-center py-4">Загрузка...</div>
                  ) : judges.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {judges.map(judge => (
                            <div key={judge.id} className="flex items-center">
                              <input
                                  type="checkbox"
                                  id={`judge-${judge.id}`}
                                  checked={selectedJudges.includes(judge.id)}
                                  onChange={() => handleJudgeSelection(judge.id)}
                                  className="mr-2 h-5 w-5"
                              />
                              <label htmlFor={`judge-${judge.id}`} className="flex-1">
                                <div className="font-medium">
                                  {judge.lastName} {judge.firstName}
                                </div>
                                <div className="text-sm text-gray-600">{judge.email}</div>
                              </label>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="text-gray-500 py-4">
                        Нет доступных судей для назначения
                      </div>
                  )}
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                      onClick={() => setIsAssignJudgeModalOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                  >
                    Отмена
                  </button>
                  <button
                      onClick={handleAssignJudges}
                      disabled={isJudgesLoading || selectedJudges.length === 0}
                      className={`px-4 py-2 ${
                          isJudgesLoading || selectedJudges.length === 0
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700'
                      } text-white rounded`}
                  >
                    Назначить выбранных
                  </button>
                </div>
              </div>
            </div>
        )}
        {/* Модальное окно редактирования события */}
        {isEventModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">
                    {currentEvent.id ? "Редактирование" : "Создание"} события
                  </h3>

                  {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                        {error}
                      </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Название*</label>
                      <input
                          type="text"
                          name="name"
                          value={currentEvent.name}
                          onChange={handleEventChange}
                          className="w-full px-3 py-2 border rounded"
                          required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Описание</label>
                      <textarea
                          name="description"
                          value={currentEvent.description}
                          onChange={handleEventChange}
                          className="w-full px-3 py-2 border rounded"
                          rows="3"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-1">Дата события*</label>
                        <input
                            type="datetime-local"
                            name="eventDate"
                            value={currentEvent.eventDate}
                            onChange={handleEventChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">Место проведения*</label>
                        <input
                            type="text"
                            name="location"
                            value={currentEvent.location}
                            onChange={handleEventChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-1">Статус</label>
                        <select
                            name="status"
                            value={currentEvent.status}
                            onChange={handleEventChange}
                            className="w-full px-3 py-2 border rounded"
                        >
                          {Object.entries(EVENT_STATUSES).map(([key, value]) => (
                              <option key={key} value={key}>{value}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">Регистрация до*</label>
                        <input
                            type="datetime-local"
                            name="registrationEnd"
                            value={currentEvent.registrationEnd}
                            onChange={handleEventChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                      onClick={() => setIsEventModalOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                  >
                    Отмена
                  </button>
                  <button
                      onClick={handleSaveEvent}
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

// Вкладка для управления пользователями

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/admin/users");
      if (!response.ok) throw new Error("Ошибка загрузки");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error('Ошибка загрузки пользователей');
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (user) => {
    setEditingUserId(user.id);
    setNewRole(user.role);
  };

  const handleRoleChange = async (userId) => {
    if (!newRole) {
      toast.error('Please select a role');
      return;
    }

    try {
      const response = await fetch(
          `http://localhost:8080/api/admin/users/${userId}/role`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }),
          }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success('Role updated successfully');
      setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
      ));
      setEditingUserId(null);
    } catch (error) {
      toast.error(error.message);
      console.error("Role update failed:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) return;

    try {
      const response = await fetch(
          `http://localhost:8080/api/admin/users/${userId}`,
          { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Ошибка удаления");

      toast.success('Пользователь удален');
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      toast.error('Ошибка удаления пользователя');
      console.error("Failed to delete user:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  return (
      <div>
        <h3 className="text-xl font-semibold mb-4">Управление пользователями</h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {editingUserId === user.id ? (
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="border rounded px-2 py-1"
                        >
                          <option value="USER">Пользователь</option>
                          <option value="JUDGE">Судья</option>
                          <option value="ADMIN">Администратор</option>
                        </select>
                    ) : (
                        (user.role || '').toLowerCase()
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {editingUserId === user.id ? (
                        <>
                          <button
                              onClick={() => handleRoleChange(user.id)}
                              className="text-green-600 hover:text-green-900"
                          >
                            Сохранить
                          </button>
                          <button
                              onClick={() => setEditingUserId(null)}
                              className="text-gray-600 hover:text-gray-900"
                          >
                            Отмена
                          </button>
                        </>
                    ) : (
                        <>
                          <button
                              onClick={() => handleEditRole(user)}
                              className="text-blue-600 hover:text-blue-900"
                          >
                            Изменить роль
                          </button>
                        </>
                    )}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default AdminPage;