import React, { useState, useEffect } from 'react';

const NormativesManagement = () => {
  const [normatives, setNormatives] = useState([]);

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Управление нормативами</h2>
        <button className="action-button">Добавить норматив</button>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Категория</th>
            <th>Возрастная группа</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {normatives.map(normative => (
            <tr key={normative.id}>
              <td>{normative.name}</td>
              <td>{normative.category}</td>
              <td>{normative.ageGroup}</td>
              <td>
                <button className="edit-button">Редактировать</button>
                <button className="delete-button">Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NormativesManagement;