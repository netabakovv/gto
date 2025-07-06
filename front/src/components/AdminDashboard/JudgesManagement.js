import React, { useState } from 'react';

const JudgesManagement = () => {
  const [judges, setJudges] = useState([]);

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Управление судьями</h2>
        <button className="action-button">Назначить судью</button>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Категория</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {judges.map(judge => (
            <tr key={judge.id}>
              <td>{judge.name}</td>
              <td>{judge.category}</td>
              <td>{judge.status}</td>
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


export default JudgesManagement;