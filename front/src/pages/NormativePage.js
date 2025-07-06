import React, { useState, useEffect, useContext } from 'react';
import jumpImage from '../images/jump.jpg';
import { useParams } from 'react-router-dom';
import { getResultsByNormativeId, addResult, updateResult, deleteResult } from '../api/results';
import ResultTable from '../components/ResultTable/ResultTable';
import AdminResultForm from '../components/AdminResultForm/AdminResultForm';
import { AuthContext } from '../contexts/AuthContext';
import {getNormativeById} from "../services/normativeService";

const NormativePage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [normative, setNormative] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingResult, setEditingResult] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const normativeData = await getNormativeById(id);
        console.log('Полученный норматив:', normativeData);
        setNormative(normativeData.data);

        const resultsData = await getResultsByNormativeId(parseInt(id));
        console.log('Results from API:', resultsData);
        setResults(resultsData); // или setResults(resultsData.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);
  
  const handleAddResult = async (resultData) => {
    try {
      const newResult = await addResult({
        ...resultData,
        normativeId: parseInt(id)
      });
      
      setResults(prev => [...prev, newResult]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Ошибка при добавлении результата:', error);
    }
  };
  
  const handleEditResult = (result) => {
    setEditingResult(result);
    setShowAddForm(false);
  };
  
  const handleUpdateResult = async (resultData) => {
    try {
      const updatedResult = await updateResult(editingResult.id, {
        ...resultData,
        normativeId: parseInt(id)
      });
      
      setResults(prev => 
        prev.map(result => 
          result.id === updatedResult.id ? updatedResult : result
        )
      );
      
      setEditingResult(null);
    } catch (error) {
      console.error('Ошибка при обновлении результата:', error);
    }
  };
  
  const handleDeleteResult = async (resultId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот результат?')) {
      try {
        await deleteResult(resultId);
        setResults(prev => prev.filter(result => result.id !== resultId));
      } catch (error) {
        console.error('Ошибка при удалении результата:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-xl">Загрузка данных...</p>
      </div>
    );
  }
  
  if (!normative) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Норматив не найден</h2>
        <p>Извините, запрашиваемый норматив не существует.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-10">
        <img
            src={jumpImage}
            alt={normative.name}
            className="normative-img"
        />
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{normative.name}</h1>
          <div className="flex items-center mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
              {normative.type + " "}
            </span>
            <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-2.5 py-0.5 rounded">
              {normative.ageGroup}
            </span>
          </div>
          
          <p className="text-gray-700 mb-6">{normative.description}</p>
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold mb-4">Требования для выполнения норматива</h2>

              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b border-gray-200 text-left">Уровень</th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left">Значение ({normative.unit})</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td className="py-3 px-4 border-b border-gray-100 font-medium text-amber-600 bg-gray-50">Золото</td>
                  <td className="py-3 px-4 border-b border-gray-100 font-medium text-gray-800">{normative.goldStandard}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b border-gray-100 font-medium text-gray-500 bg-gray-50">Серебро</td>
                  <td className="py-3 px-4 border-b border-gray-100 font-medium text-gray-800">{normative.silverStandard}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b border-gray-100 font-medium text-amber-800 bg-gray-50">Бронза</td>
                  <td className="py-3 px-4 border-b border-gray-100 font-medium text-gray-800">{normative.bronzeStandard}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
  );
};

export default NormativePage;
