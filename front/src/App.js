import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import NormativePage from './pages/NormativePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import JudgePage from './pages/JudgePage';
import EventsPage from  './pages/EventsPage';
import RoleRoute from './components/auth/RoleRoute';
import './index.css'
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/profile" element={<ProfilePage/>}/>
              <Route path="/" element={<HomePage />} />
              <Route path="/normatives/:id" element={<NormativePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route 
                path="/admin" 
                element={
        //          <RoleRoute>
                    <AdminPage />
          //        </RoleRoute>
                } 
              />
              <Route 
                path="/judge" 
                element={
            //      <RoleRoute>
                    <JudgePage />
              //    </RoleRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
