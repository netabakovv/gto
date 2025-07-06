import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <div className="max-w-[1200px] mx-auto px-4">

        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Спортивные нормативы</h3>
            <p className="text-gray-400">Система регистрации спортивных результатов</p>
          </div>


          <div>
            <h4 className="text-lg font-semibold mb-2">Контакты</h4>
            <p className="text-gray-400 mb-1">Email: info@sportresults.ru</p>
            <p className="text-gray-400 mb-1">Телефон: +7 (999) 123-45-67</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Спортивные нормативы.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;