import React, { useState } from 'react';

const CompetitionsManagement = () => {
  const [competitions, setCompetitions] = useState([]);

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Управление соревнованиями</h2>
        <button className="action-button">Добавить соревнование</button>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Дата</th>
            <th>Место</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {competitions.map(competition => (
            <tr key={competition.id}>
              <td>{competition.name}</td>
              <td>{competition.date}</td>
              <td>{competition.location}</td>
              <td>{competition.status}</td>
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

export default CompetitionsManagement;