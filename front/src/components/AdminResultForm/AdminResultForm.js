import React, { useState, useEffect } from 'react';

const AdminResultForm = ({ onSubmit, initialValues = null }) => {
  const [formData, setFormData] = useState({
    participantName: '',
    value: '',
    unit: '',
    level: 'Базовый',
    date: new Date().toISOString().split('T')[0]
  });
  
  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        date: new Date(initialValues.date).toISOString().split('T')[0]
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialValues) {
      // Очищаем форму только если это добавление нового результата
      setFormData({
        participantName: '',
        value: '',
        unit: '',
        level: 'Базовый',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-result-form">
      <h3>
        {initialValues ? 'Редактировать результат' : 'Добавить новый результат'}
      </h3>
      <div className='admin-table'>
        <div>
        <label htmlFor="participantName" className="admin-label">
          ФИО участника
        </label>
        <input
          type="text"
          id="participantName"
          name="participantName"
          value={formData.participantName}
          onChange={handleChange}
          required
            className='admin-input'
        />
        </div>
      
      <div>
      <label htmlFor="level" className="admin-label">
            Уровень достижения
          </label>
          <select
            id="level"
            name="level"
            // value={formData.level}
            // onChange={handleChange}
            required
            className="admin-select"
          >
            <option value="Базовый">Базовый</option>
            <option value="Бронза">Бронза</option>
            <option value="Серебро">Серебро</option>
            <option value="Золото">Золото</option>
          </select>
      </div>

      <div>
          <label htmlFor="value" className="admin-label">
            Результат
          </label>
          <input
            type="number"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
            step="0.01"
            className='admin-input'
          />
          </div>

<div>
          <label htmlFor="unit" className="admin-label">
            Единица измерения
          </label>
          <select
            id="unit"
            name="unit"
            // value={formData.unit}
            // onChange={handleChange}
            required
            className="admin-select"
          >
            <option value="">Выберите единицу</option>
            <option value="сек">секунды</option>
            <option value="м">метры</option>
            <option value="см">сантиметры</option>
            <option value="раз">количество раз</option>
            <option value="мин">минуты</option>
          </select>
          </div>
      


          <div>
            <label htmlFor="date" className="admin-label">
            Дата
          </label>
          <input
            type="date"
            id="date"
            name="date"
            // value={formData.date}
            // onChange={handleChange}
            required
            className="admin-input"
          />
          </div>
          </div>
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <div>{initialValues ? 'Сохранить изменения' : 'Добавить результат'}</div>
        </button>
      </div>
    </form>
  );
};

export default AdminResultForm;
