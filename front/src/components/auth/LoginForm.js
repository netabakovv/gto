import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import backImg from '../../images/logback.jpg'

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',  // Изменил username на email
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(formData.email, formData.password);

      // Добавил проверку на существование user
      if (!user) {
        throw new Error('Ошибка авторизации');
      }

      // Добавил логирование для отладки
      console.log('User after login:', user);

      if (user.isAdmin) {
        navigate('/admin');  // Изменил пути с /api/admin на /admin
      } else if (user.isJudge) {
        navigate('/judge'); // Изменил пути с /api/judge на /judge
      } else {
        navigate('/profile'); // Изменил пути с /api/profile на /profile
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Неверный email или пароль');
    }
  };

  return (
      <div className="w-[400px] h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-black text-white mx-auto mt-20">
        <div
            className="w-full h-full bg-cover bg-center p-10 backdrop-brightness-50"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backImg})`,
              backgroundBlendMode: 'darken',
            }}
        >
          <form
              onSubmit={handleSubmit}
              className="flex flex-col h-full w-full gap-2"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-shadow">Вход в систему</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-sm text-center">
                  {error}
                </div>
            )}

            <label htmlFor="email" className="text-xs uppercase pl-2 tracking-wide text-white/80">
              Email пользователя
            </label>
            <input
                type="email"  // Изменил type на email для валидации
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-10 rounded-full px-5 bg-white/30 text-white placeholder-white/70 focus:outline-none"
                placeholder="Введите email"
            />

            <label htmlFor="password" className="text-xs uppercase pl-2 tracking-wide text-white/80">
              Пароль
            </label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-10 rounded-full px-5 bg-white/30 text-white placeholder-white/70 focus:outline-none"
                placeholder="Введите пароль"
            />

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white h-10 rounded-full shadow-md mt-4"
            >
              Войти
            </button>

            <div className="text-center text-sm mt-4">
              <p>Нет аккаунта?</p>
              <Link
                  to="/register"
                  className="inline-block mt-1 text-blue-200 hover:text-blue-100 underline"
              >
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginForm;