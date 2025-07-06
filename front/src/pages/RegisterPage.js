import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import '../styles/Auth.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    gender: 'MALE',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email обязателен';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Неверный формат email';

    if (!formData.password) newErrors.password = 'Пароль обязателен';

    if (!formData.firstName) newErrors.firstName = 'Имя обязательно';
    if (!formData.lastName) newErrors.lastName = 'Фамилия обязательна';
    if (!formData.birthDate) newErrors.birthDate = 'Дата рождения обязательна';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Подготовка данных для бэкенда
      const requestData = {
        ...formData,
        birthDate: formData.birthDate || null,
        phone: formData.phone || null,
        middleName: formData.middleName || null
      };

      await register(requestData);
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (error) {
      if (error.response) {
        // Обработка ошибок с сервера
        if (error.response.status === 400) {
          setErrors(prev => ({
            ...prev,
            ...error.response.data,
            serverError: 'Проверьте введённые данные'
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            serverError: error.response.data.message || 'Ошибка регистрации'
          }));
        }
      } else {
        setErrors(prev => ({
          ...prev,
          serverError: 'Ошибка соединения с сервером'
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="auth-container">
        <h2>Регистрация</h2>

        {errors.serverError && (
            <div className="error-message">{errors.serverError}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <input
                  name="lastName"
                  type="text"
                  placeholder="Фамилия*"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <input
                  name="firstName"
                  type="text"
                  placeholder="Имя*"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
          </div>

          <div className="form-group">
            <input
                name="middleName"
                type="text"
                placeholder="Отчество"
                value={formData.middleName}
                onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
                name="birthDate"
                type="date"
                placeholder="Дата рождения*"
                value={formData.birthDate}
                onChange={handleChange}
                className={errors.birthDate ? 'error' : ''}
                max={new Date().toISOString().split('T')[0]}
            />
            {errors.birthDate && <span className="error-text">{errors.birthDate}</span>}
          </div>

          <div className="form-group">
            <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
            >
              <option value="MALE">Мужской</option>
              <option value="FEMALE">Женский</option>
            </select>
          </div>

          <div className="form-group">
            <input
                name="phone"
                type="tel"
                placeholder="Телефон (например: +79991234567)"
                value={formData.phone}
                onChange={handleChange}
                pattern="^\+?[0-9]{10,15}$"
            />
          </div>

          <div className="form-group">
            <input
                name="email"
                type="email"
                placeholder="Email*"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
                name="password"
                type="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button
              type="submit"
              disabled={isSubmitting}
              className={isSubmitting ? 'submitting' : ''}
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-footer">
          Уже есть аккаунт? <button
            onClick={() => navigate('/login')}
            className="link-button"
        >
          Войти
        </button>
        </div>
      </div>
  );
}

export default RegisterPage;