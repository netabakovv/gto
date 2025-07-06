import { useState, useEffect } from "react";
import {getProfile, updateProfile, updateUserProfile} from "../services/userService"
import ProgressStats from "../components/ProgressStats";

function ProfilePage({ auth }) {
  const [profile, setProfile] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    birthDate: "",
    gender: "",
    phone: "",
    age: 0,
    ageGroup: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getProfile(token);
          setProfile({
            id: userData.id,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            middleName: userData.middleName || "",
            email: userData.email || "",
            birthDate: userData.birthDate || "",
            gender: userData.gender || "MALE", // значение по умолчанию
            phone: userData.phone || "",
            age: userData.age || 0,
            ageGroup: userData.ageGroup || ""
          });
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await updateProfile(token, {
          firstName: profile.firstName,
          lastName: profile.lastName,
          middleName: profile.middleName,
          email: profile.email,
          birthDate: profile.birthDate,
          gender: profile.gender,
          phone: profile.phone
        });
        setIsEditing(false);
        alert("Профиль успешно обновлен");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Ошибка при обновлении профиля");
    }
  };

  if (isLoading) {
    return <div>Загрузка данных профиля...</div>;
  }

  return (
      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Мой профиль</h2>
          <button
              className={`px-4 py-2 rounded-lg ${isEditing ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? "Сохранить" : "Редактировать"}
          </button>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Личная информация</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Фамилия</label>
                  {isEditing ? (
                      <input
                          type="text"
                          value={profile.lastName}
                          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                      />
                  ) : (
                      <p className="font-medium">{profile.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Имя</label>
                  {isEditing ? (
                      <input
                          type="text"
                          value={profile.firstName}
                          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                      />
                  ) : (
                      <p className="font-medium">{profile.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Отчество</label>
                  {isEditing ? (
                      <input
                          type="text"
                          value={profile.middleName}
                          onChange={(e) => setProfile({...profile, middleName: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                      />
                  ) : (
                      <p className="font-medium">{profile.middleName || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Дата рождения</label>
                  {isEditing ? (
                      <input
                          type="date"
                          value={profile.birthDate}
                          onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                      />
                  ) : (
                      <p className="font-medium">
                        {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : "Не указана"}
                      </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Пол</label>
                  {isEditing ? (
                      <select
                          value={profile.gender}
                          onChange={(e) => setProfile({...profile, gender: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="MALE">Мужской</option>
                        <option value="FEMALE">Женский</option>
                      </select>
                  ) : (
                      <p className="font-medium">{profile.gender === 'MALE' ? 'Мужской' : 'Женский'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Возраст</label>
                  <p className="font-medium">{profile.age} лет</p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Возрастная группа</label>
                  <p className="font-medium">{profile.ageGroup}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Контактная информация</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Email</label>
                  {isEditing ? (
                      <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                      />
                  ) : (
                      <p className="font-medium">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Телефон</label>
                  {isEditing ? (
                      <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                      />
                  ) : (
                      <p className="font-medium">{profile.phone || "-"}</p>
                  )}
                </div>

                {isEditing && (
                    <div className="mt-6">
                      <h4 className="text-md font-medium mb-3">Смена пароля</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-gray-700 mb-1 text-sm">Текущий пароль</label>
                          <input
                              type="password"
                              placeholder="Введите текущий пароль"
                              className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-1 text-sm">Новый пароль</label>
                          <input
                              type="password"
                              placeholder="Введите новый пароль"
                              className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-1 text-sm">Подтвердите новый пароль</label>
                          <input
                              type="password"
                              placeholder="Повторите новый пароль"
                              className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ProfilePage;