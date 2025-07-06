export const normativesData = [
    {
      id: 1,
      name: 'Бег на 100 метров',
      category: 'Легкая атлетика',
      ageGroup: '18-24 года',
      description: 'Бег на короткую дистанцию, проводится на беговой дорожке стадиона.',
      imageUrl: '/api/placeholder/300/200',
      requirements: {
        bronze: { male: '14.8 сек', female: '17.8 сек' },
        silver: { male: '14.0 сек', female: '16.5 сек' },
        gold: { male: '13.6 сек', female: '16.0 сек' }
      }
    },
    {
      id: 2,
      name: 'Подтягивание на перекладине',
      category: 'Силовые упражнения',
      ageGroup: '18-24 года',
      description: 'Выполняется из виса хватом сверху, руки на ширине плеч.',
      imageUrl: '/api/placeholder/300/200',
      requirements: {
        bronze: { male: '9 раз', female: '9 раз' },
        silver: { male: '12 раз', female: '12 раз' },
        gold: { male: '15 раз', female: '15 раз' }
      }
    },
    {
      id: 3,
      name: 'Прыжок в длину с места',
      category: 'Легкая атлетика',
      ageGroup: '18-24 года',
      description: 'Выполняется из положения стоя, толчком двумя ногами.',
      imageUrl: '/api/placeholder/300/200',
      requirements: {
        bronze: { male: '210 см', female: '170 см' },
        silver: { male: '225 см', female: '180 см' },
        gold: { male: '240 см', female: '195 см' }
      }
    },
    {
      id: 4,
      name: 'Наклон вперед из положения стоя',
      category: 'Гибкость',
      ageGroup: '18-24 года',
      description: 'Выполняется на гимнастической скамье.',
      imageUrl: '/api/placeholder/300/200',
      requirements: {
        bronze: { male: '+8 см', female: '+11 см' },
        silver: { male: '+10 см', female: '+13 см' },
        gold: { male: '+13 см', female: '+16 см' }
      }
    },
    {
      id: 5,
      name: 'Бег на 3 км',
      category: 'Легкая атлетика',
      ageGroup: '18-24 года',
      description: 'Бег на длинную дистанцию, проводится на беговой дорожке стадиона или по пересеченной местности.',
      imageUrl: '/api/placeholder/300/200',
      requirements: {
        bronze: { male: '14:30 мин', female: '17:30 мин' },
        silver: { male: '13:30 мин', female: '16:30 мин' },
        gold: { male: '12:30 мин', female: '15:30 мин' }
      }
    },
    {
      id: 6,
      name: 'Плавание 50 м',
      category: 'Плавание',
      ageGroup: '18-24 года',
      description: 'Проплыть дистанцию 50 метров вольным стилем.',
      imageUrl: '/api/placeholder/300/200',
      requirements: {
        bronze: { male: '1:10 мин', female: '1:25 мин' },
        silver: { male: '1:00 мин', female: '1:15 мин' },
        gold: { male: '0:50 мин', female: '1:05 мин' }
      }
    },
  ];
  
  // Получить все нормативы
  export const getNormatives = () => {
    return Promise.resolve(normativesData);
  };
  
  // Получить норматив по ID
  export const getNormativeById = (id) => {
    const normative = normativesData.find(norm => norm.id === parseInt(id));
    return Promise.resolve(normative || null);
  };
  