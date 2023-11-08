import { useState } from 'react';
import { login, signup } from '../../../services/api-service';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../../../services/auth-service';

export default function Auth() {
    const initialValueSignUp = {
        pseudo: '',
        mail: '',
        password: '',
    };
    const initialValueLogin = {
        mail: '',
        password: '',
    };
    const [formValuesSignUp, setInputesValuesSignUp] =
        useState(initialValueSignUp);
    const [formValuesLogin, setInputesValuesLogin] =
        useState(initialValueLogin);
    const [onSignUp, setOnSignUp] = useState(true);

    const navigate = useNavigate();

    function handleChangeSignUp(e) {
        setInputesValuesSignUp({
            ...formValuesSignUp,
            [e.target.name]: e.target.value,
        });
    }

    function handleChangeLogin(e) {
        setInputesValuesLogin({
            ...formValuesLogin,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmitSignUp(e) {
        e.preventDefault();
        console.log('SignUp:');
        console.log(formValuesSignUp);

        signup(formValuesSignUp).then((data) => {
            if(data.error){
                //TODO : Gestion du message d'erreur
            }else{
                setInputesValuesSignUp(initialValueSignUp);
                changement();
            }
          }
        ); 
    }

    function handleSubmitLogin(e) {
        e.preventDefault();
        console.log('Login:');
        console.log(formValuesLogin);

        login(formValuesLogin).then((data) => {
            if(data.error){
                //TODO : Gestion du message d'erreur
            }else{
                setInputesValuesSignUp(formValuesLogin);
                navigate("/");
                saveToken(data.token);
            }
          }
        );
    }

    function changement() {
        setOnSignUp(!onSignUp);
    }

    return (
        <>
            <div className="auth-container-all">
                <div
                    className={
                        onSignUp ? 'auth-wrapper' : 'auth-wrapper auth-active'
                    }
                >
                    <div className="auth-form auth-signup">
                        <div className="auth-header" onClick={changement}>
                            Signup
                        </div>
                        <form onSubmit={(e) => handleSubmitSignUp(e)}>
                            <div className="auth-form-row">
                                <div className="auth-input-data">
                                    <input
                                        type="text"
                                        name="pseudo"
                                        value={formValuesSignUp.pseudo}
                                        onChange={handleChangeSignUp}
                                        required
                                    />
                                    <div className="auth-underline"></div>
                                    <label>Pseudo</label>
                                </div>
                            </div>
                            <div className="auth-form-row">
                                <div className="auth-input-data auth-mail">
                                    <input
                                        type="mail"
                                        name="mail"
                                        value={formValuesSignUp.mail}
                                        onChange={handleChangeSignUp}
                                        required
                                    />
                                    <div className="auth-underline"></div>
                                    <label>Mail</label>
                                </div>
                            </div>
                            <div className="auth-form-row">
                                <div className="auth-input-data">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formValuesSignUp.password}
                                        onChange={handleChangeSignUp}
                                        required
                                    />
                                    <div className="auth-underline"></div>
                                    <label>Mot de passe</label>
                                </div>
                            </div>
                            <br></br>
                            <div className="auth-center-button">
                                <button
                                    type="submit"
                                    className="auth-submit-button"
                                >
                                    Valider
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="auth-form auth-login">
                        <div className="auth-header" onClick={changement}>
                            Login
                        </div>
                        <br />
                        <form onSubmit={(e) => handleSubmitLogin(e)}>
                            <div className="auth-form-row">
                                <div className="auth-input-data">
                                    <input
                                        type="mail"
                                        name="mail"
                                        value={formValuesLogin.mail}
                                        onChange={handleChangeLogin}
                                        required
                                    />
                                    <div className="auth-underline"></div>
                                    <label>Mail</label>
                                </div>
                            </div>
                            <div className="auth-form-row">
                                <div className="auth-input-data">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formValuesLogin.password}
                                        onChange={handleChangeLogin}
                                        required
                                    />
                                    <div className="auth-underline"></div>
                                    <label>Mot de passe</label>
                                </div>
                            </div>
                            <br></br>
                            <div className="auth-center-button">
                                <button
                                    type="submit"
                                    className="auth-submit-button"
                                >
                                    Valider
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
