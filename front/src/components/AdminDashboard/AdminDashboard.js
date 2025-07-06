import React, { useState } from 'react';
import NormativesManagement from "./NormativesManagement";
import CompetitionsManagement from "./CompetitionsManagement";
import JudgesManagement from "./JudgesManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('normatives');

  return (
    <div className="admin-dashboard">
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'normatives' ? 'active' : ''}`}
          onClick={() => setActiveTab('normatives')}
        >
          Нормативы
        </button>
        <button 
          className={`tab-button ${activeTab === 'competitions' ? 'active' : ''}`}
          onClick={() => setActiveTab('competitions')}
        >
          Соревнования
        </button>
        <button 
          className={`tab-button ${activeTab === 'judges' ? 'active' : ''}`}
          onClick={() => setActiveTab('judges')}
        >
          Судьи
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'normatives' && <NormativesManagement />}
        {activeTab === 'competitions' && <CompetitionsManagement />}
        {activeTab === 'judges' && <JudgesManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;