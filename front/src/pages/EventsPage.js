import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllEvents, registerOnEvent } from "../services/eventService";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("UPCOMING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllEvents();
        setEvents(response.data);
      } catch (err) {
        setError("Не удалось загрузить мероприятия");
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      setError(null);
      await registerOnEvent(eventId);

      // Обновляем список мероприятий после успешной регистрации
      const response = await getAllEvents();
      setEvents(response.data);

      // Можно добавить уведомление об успехе
      alert('Вы успешно зарегистрированы на мероприятие!');

    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);

      // Автоматический редирект при 401 уже обработан в registerOnEvent
    }
  };

  const filteredEvents = events.filter(event => event.status === activeTab);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Загрузка мероприятий...</div>
        </div>
    );
  }

  return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Мероприятия</h2>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
        )}

        <div className="flex mb-6">
          <button
              className={`px-4 py-2 rounded-l-lg ${
                  activeTab === 'UPCOMING' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('UPCOMING')}
          >
            Предстоящие
          </button>
          <button
              className={`px-4 py-2 rounded-r-lg ${
                  activeTab === 'PAST' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('PAST')}
          >
            Прошедшие
          </button>
        </div>

        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                  <div key={event.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                        <p className="text-gray-600">
                          {new Date(event.eventDate).toLocaleDateString('ru-RU')} • {event.location}
                        </p>
                        {event.registrationEnd && (
                            <p className="text-sm text-gray-500 mt-1">
                              Регистрация до: {new Date(event.registrationEnd).toLocaleString('ru-RU')}
                              {event.registeredCount > 0 && (
                                  <span className="ml-2">• Зарегистрировано: {event.registeredCount}</span>
                              )}
                            </p>
                        )}
                      </div>
                      {activeTab === 'UPCOMING' && event.registrationOpen && localStorage.getItem("token") && localStorage.getItem("isAdmin")==localStorage.getItem("isJudge")?(
                          <button
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                              onClick={() => handleRegister(event.id)}
                          >
                            Записаться
                          </button>
                      ):(
                          <button
                              className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                              title="Записаться могут только пользователи"
                              disabled
                          >
                            Записаться
                          </button>
                      )}
                    </div>

                    {event.description && (
                        <p className="mt-2 text-gray-700">{event.description}</p>
                    )}

                    {event.normatives && event.normatives.length > 0 && (
                        <div className="mt-4">
                          <p className="font-medium mb-2">Нормативы для сдачи:</p>
                          <div className="flex flex-wrap gap-2">
                            {event.normatives.map(normative => (
                                <span
                                    key={normative.id}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    title={`${normative.description}\nЗолото: ${normative.goldValue} ${normative.unit}\nСеребро: ${normative.silverValue} ${normative.unit}\nБронза: ${normative.bronzeValue} ${normative.unit}`}
                                >
                        {normative.name}
                      </span>
                            ))}
                          </div>
                        </div>
                    )}

                    {activeTab === 'PAST' && (
                        <div className="mt-4">
                          <Link
                              to={`/events/${event.id}/results`}
                              className="text-blue-600 hover:underline text-sm"
                          >
                            Просмотреть результаты
                          </Link>
                        </div>
                    )}
                  </div>
              ))
          ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600">
                  Нет {activeTab === 'UPCOMING' ? 'предстоящих' : 'прошедших'} мероприятий
                </p>
              </div>
          )}
        </div>
      </div>
  );
}

export default EventsPage;