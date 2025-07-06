import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    middleName: "",
    birthDate: "",
    gender: "male"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // В реальном приложении здесь будет запрос к API
      // const response = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Ошибка авторизации');
      // }
      
      // localStorage.setItem('token', data.token);
      // localStorage.setItem('user', JSON.stringify(data.user));
      
      // Эмуляция успешной авторизации
      console.log("Авторизация успешна", formData);
      localStorage.setItem('token', 'fake-token-123');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        firstName: formData.firstName || "Иван",
        lastName: formData.lastName || "Иванов",
        role: "user",
        email: formData.email
      }));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Ошибка:', error);
      setError(error.message || 'Произошла ошибка при авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Вход в систему" : "Регистрация"}
        </h2>
        
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-l-lg`}
            onClick={() => setIsLogin(true)}
          >
            Вход
          </button>
          <button
            className={`flex-1 py-2 ${!isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-r-lg`}
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@mail.ru"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="lastName">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Иванов"
                    value={formData.lastName}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="firstName">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Иван"
                    value={formData.firstName}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="middleName">
                  Отчество
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Иванович"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="birthDate">
                  Дата рождения
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
              
              <div className="mb-6"></div>