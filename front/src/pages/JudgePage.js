import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function JudgePage() {
  const [myEvents, setMyEvents] = useState([]);
  const [allNorms, setAllNorms] = useState([]); // Все нормативы
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [results, setResults] = useState({});
  const navigate = useNavigate();

  // Загрузка всех мероприятий и нормативов
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Загружаем мероприятия и нормативы параллельно
        const [eventsResponse, normsResponse] = await Promise.all([
          fetch('http://localhost:8080/api/judge/my-events', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('http://localhost:8080/api/normatives', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        if (!eventsResponse.ok) throw new Error('Ошибка загрузки мероприятий');
        if (!normsResponse.ok) throw new Error('Ошибка загрузки нормативов');

        const eventsData = await eventsResponse.json();
        const normsData = await normsResponse.json();

        setMyEvents(eventsData);
        setAllNorms(normsData);
      } catch (error) {
        toast.error(error.message);
        console.error('Ошибка:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Загрузка участников выбранного мероприятия
  const fetchEventParticipants = async (eventId) => {
    try {
      setLoading(true);
      setParticipants([]);

      const response = await fetch(`http://localhost:8080/api/events/${eventId}/participants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Ошибка загрузки участников');

      const data = await response.json();
      setParticipants(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
      console.error('Ошибка:', error);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = async (eventId) => {
    const event = myEvents.find(e => e.id === eventId);
    if (!event) {
      toast.error('Мероприятие не найдено');
      return;
    }

    setSelectedEvent(event);
    setSelectedParticipant(null);
    setResults({});

    await fetchEventParticipants(eventId);
  };

  // Загрузка существующих результатов участника
  const fetchExistingResults = async (participantId, eventId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/results/user/${participantId}/event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const existingResults = await response.json();
        const resultsMap = {};
        existingResults.forEach(result => {
          resultsMap[result.normId] = result.value;
        });
        setResults(resultsMap);
      }
    } catch (error) {
      console.error('Ошибка загрузки результатов:', error);
    }
  };

  const handleParticipantSelect = (participant) => {
    setSelectedParticipant(participant);
    if (selectedEvent?.id) {
      fetchExistingResults(participant.id, selectedEvent.id);
    }
  };

  const handleResultChange = (normId, value) => {
    setResults(prev => ({
      ...prev,
      [normId]: value
    }));
  };

  const handleSubmitResults = async () => {
    if (!selectedEvent || !selectedParticipant || !allNorms) return;

    try {
      setLoading(true);

      // Подготовка данных для отправки
      const resultsToSend = allNorms
          .filter(norm => results[norm.id] !== undefined && results[norm.id] !== "")
          .map(norm => ({
            userId: selectedParticipant.id,
            eventId: selectedEvent.id,
            normativeId: norm.id,
            value: parseFloat(results[norm.id])
          }));

      const response = await fetch('http://localhost:8080/api/results/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(resultsToSend)
      });

      if (!response.ok) throw new Error('Ошибка сохранения результатов');

      const data = await response.json();
      toast.success(`Успешно сохранено ${data.length} результатов`);

      // Обновляем список участников
      await fetchEventParticipants(selectedEvent.id);
      setSelectedParticipant(null);
      setResults({});
    } catch (error) {
      toast.error(error.message);
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = () => {
    if (!selectedEvent || !selectedParticipant || !allNorms) return false;

    // Проверяем только обязательные нормативы
    return allNorms.filter(norm => norm.required).every(norm => {
      return results[norm.id] !== undefined && results[norm.id] !== "";
    });
  };

  if (loading && !selectedEvent) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Загрузка данных...</div>
        </div>
    );
  }

  return (
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Панель судьи</h2>

        {!selectedEvent ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">Мои мероприятия</h3>

              {myEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myEvents.map(event => (
                        <div
                            key={event.id}
                            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => handleEventSelect(event.id)}
                        >
                          <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Дата:</span> {new Date(event.eventDate).toLocaleDateString('ru-RU')}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Место:</span> {event.location}
                          </p>
                          <div className="mt-2 text-sm text-blue-600">
                            {allNorms.length} нормативов • {event.registeredCount || 0} участников
                          </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-gray-600">У вас нет назначенных мероприятий</p>
                  </div>
              )}
            </div>
        ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
                  <p className="text-gray-600">
                    {new Date(selectedEvent.eventDate).toLocaleDateString('ru-RU')} • {selectedEvent.location}
                  </p>
                </div>
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    onClick={() => setSelectedEvent(null)}
                >
                  Назад к списку
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Список участников */}
                <div className="lg:w-1/3 bg-white p-4 rounded-lg shadow-md">
                  <h4 className="font-medium mb-4">Участники ({participants.length})</h4>

                  {participants.length > 0 ? (
                      <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {participants.map(participant => (
                            <div
                                key={participant.id}
                                className={`p-3 rounded cursor-pointer transition-colors ${
                                    selectedParticipant?.id === participant.id
                                        ? 'bg-blue-100 border border-blue-300'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                                onClick={() => handleParticipantSelect(participant)}
                            >
                              <p className="font-medium">
                                {participant.lastName} {participant.firstName} {participant.middleName}
                              </p>
                              <div className="flex justify-between text-sm text-gray-600 mt-1">
                                <span>{participant.age} лет</span>
                                <span>{participant.gender === 'MALE' ? 'мужской' : 'женский'}</span>
                              </div>
                              {participant.resultsCount > 0 && (
                                  <div className="text-xs text-green-600 mt-1">
                                    {participant.resultsCount} результатов внесено
                                  </div>
                              )}
                            </div>
                        ))}
                      </div>
                  ) : (
                      <p className="text-gray-600 text-center py-4">
                        {loading ? 'Загрузка участников...' : 'Нет зарегистрированных участников'}
                      </p>
                  )}
                </div>

                {/* Форма ввода результатов */}
                <div className="lg:w-2/3 bg-white p-4 rounded-lg shadow-md">
                  {selectedParticipant ? (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">
                            Результаты: {selectedParticipant.lastName} {selectedParticipant.firstName}
                          </h4>
                          <button
                              className="text-sm text-gray-500 hover:text-gray-700"
                              onClick={() => setSelectedParticipant(null)}
                          >
                            Выбрать другого участника
                          </button>
                        </div>

                        {allNorms.length > 0 ? (
                            <>
                              <div className="space-y-4 mb-6">
                                {allNorms.map(norm => (
                                    <div key={norm.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 border-b">
                                      <label className="w-full sm:w-1/2 font-medium">
                                        {norm.name}
                                        {norm.required && <span className="text-red-500 ml-1">*</span>}
                                      </label>
                                      <div className="flex items-center w-full sm:w-1/2">
                                        <input
                                            type={norm.type === 'time' ? 'time' : 'number'}
                                            step={norm.type === 'time' ? '1' : '0.01'}
                                            min="0"
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={results[norm.id] || ""}
                                            onChange={(e) => handleResultChange(norm.id, e.target.value)}
                                            placeholder={`Введите ${norm.type === 'count' ? 'количество' : 'значение'}`}
                                        />
                                        <span className="ml-2 text-gray-600 whitespace-nowrap">{norm.unit}</span>
                                      </div>
                                    </div>
                                ))}
                              </div>

                              <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                    onClick={() => {
                                      setSelectedParticipant(null);
                                      setResults({});
                                    }}
                                >
                                  Отмена
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    onClick={handleSubmitResults}
                                    disabled={!isFormComplete()}
                                >
                                  Сохранить результаты
                                </button>
                              </div>
                            </>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                              Нормативы не загружены
                            </div>
                        )}
                      </>
                  ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Выберите участника для внесения результатов</p>
                        <p className="text-sm text-gray-500">
                          Нажмите на участника из списка слева, чтобы начать ввод результатов
                        </p>
                      </div>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default JudgePage;