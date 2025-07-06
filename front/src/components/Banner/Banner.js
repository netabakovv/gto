import React from 'react';
import backIm from '../../images/logback.jpg'

const Banner = () => {
  return (
    <div style={{ backgroundImage: `url(${backIm})` }}
      className="relative bg-center bg-black/70 bg-blend-darken bg-cover text-white min-h-[500px] flex items-center"
>
      <div className="max-w-[1200px] mx-auto px-4 py-16 flex flex-col items-center md:flex-row">
        <div className="mb-8 md:mb-0 md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Спортивные нормативы</h2>
          <p className="text-xl mb-6">
            Система регистрации и отслеживания спортивных результатов для всех видов физической активности
          </p>
          <button className="bg-white text-blue-600 font-semibold rounded-lg px-6 py-2 transition-colors duration-300 hover:bg-[#f0f7ff]">
            <div>Узнать больше</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
