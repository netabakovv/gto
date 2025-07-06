import React from 'react';

const ResultTable = ({ results, showActions = false, onEdit, onDelete }) => {
  if (!results || results.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        Результаты отсутствуют
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Дата
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Участник
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Результат
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Уровень
            </th>
            {showActions && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr 
              key={result.id} 
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(result.date).toLocaleDateString('ru-RU')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {result.participantName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {result.value} {result.unit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  result.level === 'Золото' ? 'bg-yellow-100 text-yellow-800' :
                  result.level === 'Серебро' ? 'bg-gray-100 text-gray-800' :
                  result.level === 'Бронза' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {result.level}
                </span>
              </td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => onEdit(result)} 
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <div>Изменить</div>
                  </button>
                  <button 
                    onClick={() => onDelete(result.id)} 
                    className="text-red-600 hover:text-red-900"
                  >
                    <div>Удалить</div>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
