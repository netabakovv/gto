import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner/Banner';
import NormativeList from '../components/NormativeList/NormativeList';
import {getAllNormatives} from "../services/normativeService";
import axios from "axios";

const HomePage = () => {
  const [normatives, setNormatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/api/normatives')
            .then(res => {
                console.log("API response:", res.data);
                setNormatives(res.data); // если backend возвращает массив
                setIsLoading(false);     // <== обязательно!
            })
            .catch(error => {
                console.error("Ошибка при загрузке нормативов:", error);
                setIsLoading(false);     // даже в случае ошибки скрываем "загрузку"
            });
    }, []);

  
  return (
    <div>
      <Banner />
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-xl">Загрузка нормативов...</p>
        </div>
      ) : (
        <NormativeList normatives={normatives} />
      )}
    </div>
  );
};

export default HomePage;