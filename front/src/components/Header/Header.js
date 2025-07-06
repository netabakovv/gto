import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { logout, isAdmin, isJudge } = useContext(AuthContext);
  const navigate = useNavigate(); // Хук для навигации

  const handleLogout = () => {
    logout(); // Вызываем метод logout из контекста
    navigate('/'); // Перенаправляем на главную страницу
  };

  // Получаем значения из localStorage
  const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
  const storedIsJudge = localStorage.getItem('isJudge') === 'true';
  const isAuthenticated = !!localStorage.getItem('token');

  // Объединяем значения из контекста и localStorage
  const userIsAdmin = isAdmin || storedIsAdmin;
  const userIsJudge = isJudge || storedIsJudge;

  return (
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-[1200px] mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-white no-underline">ГТО Платформа</Link>
          <nav>
            <ul className="flex items-center gap-6 list-none m-0 p-0">
              <li>
                <Link to="/events" className="text-white hover:text-blue-200 no-underline transition-colors duration-200">
                  Мероприятия
                </Link>
              </li>
              {isAuthenticated ? (
                  <>
                    {userIsAdmin && (
                        <li>
                          <Link to="/admin" className="text-white hover:text-blue-200 no-underline transition-colors duration-200">
                            Панель администратора
                          </Link>
                        </li>
                    )}
                    {userIsJudge && !userIsAdmin && (
                        <li>
                          <Link to="/judge" className="text-white hover:text-blue-200 no-underline transition-colors duration-200">
                            Панель судьи
                          </Link>
                        </li>
                    )}
                    {(!userIsJudge && !userIsAdmin) && (
                        <li>
                          <Link to="/profile" className="text-white hover:text-blue-200 no-underline transition-colors duration-200">
                            Профиль
                          </Link>
                        </li>
                    )}
                    <li>
                      <button
                          onClick={handleLogout}
                          className="bg-white text-blue-700 font-medium py-1 px-3 rounded hover:bg-blue-100 transition-colors duration-200"
                      >
                        Выход
                      </button>
                    </li>
                  </>
              ) : (
                  <li>
                    <Link to="/login" className="text-white hover:text-blue-200 no-underline transition-colors duration-200">
                      Войти
                    </Link>
                  </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
  );
};

export default Header;