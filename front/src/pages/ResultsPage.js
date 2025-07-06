import React, { useState, useEffect } from "react";

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [badges, setBadges] = useState([]);
  const [currentBadge, setCurrentBadge] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("results");
  
  // Загрузка данных пользователя
  useEffect(() => {
    // В реальном приложении здесь будут запросы к API
    // fetchUserResults();
    // fetchUserBadges();
    // fetchUserCertificate();
    
    // Имитация данных
    setResults([
      {
        id: 1,
        eventName: "Весенний забег",
        date: "2025-04-15",
        norms: [
          { name: "Бег 100м", result: "13.2", unit: "сек", status: "gold", required: { bronze: "14.1", silver: "13.1", gold: "12.7" } },
          { name: "Бег 2км", result: "8:45", unit: "мин", status: "silver", required: { bronze: "9:30", silver: "8:50", gold: "8:15" } },
          { name: "Прыжок в длину", result: "220", unit: "см", status: "bronze", required: { bronze: "210", silver: "230", gold: "250" } }
        ],
        overallStatus: "silver"
      },
      {
        id: 2,
        eventName: "Многоборье ГТО",
        date: "2025-03-22",
        norms: [
          { name: "Подтягивание", result: "12", unit: "раз", status: "gold", required: { bronze: "9", silver: "11", gold: "13" } },
          { name: "Отжимания", result: "35", unit: "раз", status: "silver", required: { bronze: "28", silver: "32", gold: "42" } },
          { name: "Пресс", result: "48", unit: "раз", status: "gold", required: { bronze: "36", silver: "42", gold: "47" } },
          { name: "Наклон вперед", result: "8", unit: "см", status: "silver", required: { bronze: "5", silver: "7", gold: "11" } }
        ],
        overallStatus: "silver"
      },
      {
        id: 3,
        eventName: "Зимние нормативы",
        date: "2025-01-15",
        norms: [
          { name: "Лыжи 5км", result: "28:30", unit: "мин", status: "fail", required: { bronze: "29:00", silver: "27:30", gold: "26:00" } },
          { name: "Метание снаряда", result: "32", unit: "м", status: "bronze", required: { bronze: "30", silver: "35", gold: "40" } }
        ],
        overallStatus: "fail"
      }
    ]);
    
    setBadges([
      { id: 1, type: "silver", eventName: "Весенний забег", date: "2025-04-15", certificateNumber: "ГТО-2025-001234" },
      { id: 2, type: "silver", eventName: "Многоборье ГТО", date: "2025-03-22", certificateNumber: "ГТО-2025-001156" }
    ]);
    
    setCurrentBadge("silver");
    
    setCertificate({
      number: "ГТО-2025-001234",
      type: "silver",
      dateIssued: "2025-04-15",
      validUntil: "2027-04-15",
      holder: {
        lastName: "Иванов",
        firstName: "Иван",
        middleName: "Иванович",
        birthDate: "1990-05-15"
      }
    });
    
    setLoading(false);
  }, []);
  
  // Получение цвета для статуса
  const getStatusColor = (status) => {
    switch (status) {
      case "gold": return "text-yellow-600 bg-yellow-100";
      case "silver": return "text-gray-600 bg-gray-100";
      case "bronze": return "text-orange-600 bg-orange-100";
      case "fail": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };
  
  // Получение текста для статуса
  const getStatusText = (status) => {
    switch (status) {
      case "gold": return "Золото";
      case "silver": return "Серебро";
      case "bronze": return "Бронза";
      case "fail": return "Не сдано";
      default: return "Не определено";
    }
  };
  
  // Получение иконки значка
  const getBadgeIcon = (type) => {
    const baseClass = "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold";
    switch (type) {
      case "gold": 
        return <div className={`${baseClass} bg-yellow-400 text-yellow-800`}>🥇</div>;
      case "silver": 
        return <div className={`${baseClass} bg-gray-300 text-gray-700`}>🥈</div>;
      case "bronze": 
        return <div className={`${baseClass} bg-orange-400 text-orange-800`}>🥉</div>;
      default: 
        return <div className={`${baseClass} bg-gray-200 text-gray-500`}>—</div>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Загрузка результатов...</div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Мои результаты ГТО</h2>
      
      {/* Навигационные вкладки */}
      <div className="flex mb-6 space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'results' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('results')}
        >
          Результаты тестирования
        </button>
        <button
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'badges' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('badges')}
        >
          Мои значки
        </button>
        <button
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'certificate' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('certificate')}
        >
          Удостоверение
        </button>
      </div>
      
      {/* Вкладка "Результаты" */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {results.length > 0 ? (
            results.map(result => (
              <div key={result.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{result.eventName}</h3>
                    <p className="text-gray-600 mt-1">{new Date(result.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(result.overallStatus)}`}>
                    Общий результат: {getStatusText(result.overallStatus)}
                  </span>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {result.norms.map((norm, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-800">{norm.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(norm.status)}`}>
                          {getStatusText(norm.status)}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-blue-600 mb-2">
                        {norm.result} {norm.unit}
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>🥉 {norm.required.bronze} {norm.unit}</div>
                        <div>🥈 {norm.required.silver} {norm.unit}</div>
                        <div>🥇 {norm.required.gold} {norm.unit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Результатов пока нет</h3>
              <p className="text-gray-500">Запишитесь на мероприятие, чтобы начать сдавать нормативы ГТО</p>
            </div>
          )}
        </div>
      )}
      
      {/* Вкладка "Значки" */}
      {activeTab === 'badges' && (
        <div>
          {/* Текущий значок */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Текущий значок ГТО</h3>
            <div className="flex flex-col items-center">
              {getBadgeIcon(currentBadge)}
              <div className="text-center mt-4">
                <div className="text-xl font-bold text-gray-800">
                  Значок {getStatusText(currentBadge)} степени
                </div>
                <div className="text-gray-600 mt-1">
                  Действует до {certificate?.validUntil && new Date(certificate.validUntil).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
          </div>
          
          {/* История значков */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">История полученных значков</h3>
            {badges.length > 0 ? (
              <div className="space-y-4">
                {badges.map(badge => (
                  <div key={badge.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12">
                        {getBadgeIcon(badge.type)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{badge.eventName}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(badge.date).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(badge.type)}`}>
                        {getStatusText(badge.type)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        №{badge.certificateNumber}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-3">🏅</div>
                <p className="text-gray-500">Значков пока нет</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Вкладка "Удостоверение" */}
      {activeTab === 'certificate' && (
        <div>
          {certificate ? (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  УДОСТОВЕРЕНИЕ
                </h3>
                <p className="text-lg text-gray-600">
                  о выполнении нормативов испытаний (тестов)<br/>
                  Всероссийского физкультурно-спортивного комплекса<br/>
                  "Готов к труду и обороне" (ГТО)
                </p>
              </div>
              
              <div className="border-2 border-gray-300 p-6 rounded-lg bg-gradient-to-br from-blue-50 to-white">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Номер удостоверения:</div>
                    <div className="font-bold text-lg">{certificate.number}</div>
                  </div>
                  <div className="flex justify-end">
                    {getBadgeIcon(certificate.type)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Фамилия, имя, отчество:</div>
                    <div className="font-semibold">
                      {certificate.holder.lastName} {certificate.holder.firstName} {certificate.holder.middleName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Дата рождения:</div>
                    <div className="font-semibold">
                      {new Date(certificate.holder.birthDate).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Знак отличия:</div>
                    <div className="font-semibold text-lg capitalize">
                      {getStatusText(certificate.type)} степень
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Дата выдачи:</div>
                    <div className="font-semibold">
                      {new Date(certificate.dateIssued).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600 mb-1">Действительно до:</div>
                  <div className="font-semibold text-red-600">
                    {new Date(certificate.validUntil).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Скачать PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📜</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Удостоверение не выдано</h3>
              <p className="text-gray-500">
                Выполните необходимые нормативы для получения знака отличия ГТО
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResultsPage;