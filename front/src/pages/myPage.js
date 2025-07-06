import "../App.css";

const myLog = () => {
    return (
        <div className="login">
            <form>
                <h1>ВХОД</h1>
                <label>Логин</label>
                <input 
                    type="text" 
                />
                <label>Пароль</label>
                <input 
                    type="password" 
                />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginPage;