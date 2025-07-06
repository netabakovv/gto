let resultsData = [
    {
      id: 1,
      normativeId: 1,
      participantName: 'Иванов Иван',
      value: 12.8,
      unit: 'сек',
      level: 'Золото',
      date: '2024-05-01'
    },
    {
      id: 2,
      normativeId: 1,
      participantName: 'Петров Петр',
      value: 13.5,
      unit: 'сек',
      level: 'Серебро',
      date: '2024-05-02'
    },
    {
      id: 3,
      normativeId: 2,
      participantName: 'Сидоров Алексей',
      value: 13,
      unit: 'раз',
      level: 'Бронза',
      date: '2024-05-03'
    },
    {
      id: 4,
      normativeId: 3,
      participantName: 'Козлов Дмитрий',
      value: 235,
      unit: 'см',
      level: 'Серебро',
      date: '2024-05-04'
    }
  ];
  
  // Получить результаты по ID норматива
  export const getResultsByNormativeId = (normativeId) => {
    const results = resultsData.filter(result => result.normativeId === parseInt(normativeId));
    return Promise.resolve(results);
  };
  
  // Добавить новый результат
  export const addResult = (result) => {
    const newResult = {
      ...result,
      id: resultsData.length + 1
    };
    
    resultsData.push(newResult);
    return Promise.resolve(newResult);
  };
  
  // Обновить результат
  export const updateResult = (id, updatedResult) => {
    const index = resultsData.findIndex(result => result.id === parseInt(id));
    
    if (index !== -1) {
      resultsData[index] = {
        ...resultsData[index],
        ...updatedResult,
        id: parseInt(id)
      };
    }
    
    return Promise.resolve(resultsData[index] || null);
  };
  
  // Удалить результат
  export const deleteResult = (id) => {
    const index = resultsData.findIndex(result => result.id === parseInt(id));
    
    if (index !== -1) {
      resultsData.splice(index, 1);
    }
    
    return Promise.resolve({ success: true });
  };
  
  // pages/HomePage.jsx
 
  