import { useState } from 'react';
import { login, signup } from '../../../services/api-service';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';

export default function Auth() {
    const { loginContext } = useContext(AuthContext);

    const initialValueSignUp = {
        pseudo: {
            value: '',
            error: false,
            errorMessage: '',
        },
        mail: {
            value: '',
            error: false,
            errorMessage: '',
        },
        password: {
            value: '',
            error: false,
            errorMessage: '',
        },
    };
    const initialValueLogin = {
        mail: {
            value: '',
            error: false,
            errorMessage: '',
        },
        password: {
            value: '',
            error: false,
            errorMessage: '',
        },
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
            pseudo: {
                ...formValuesSignUp.pseudo,
                error: false,
                errorMessage: '',
            },
            mail: {
                ...formValuesSignUp.mail,
                error: false,
                errorMessage: '',
            },
            password: {
                ...formValuesSignUp.password,
                error: false,
                errorMessage: '',
            },
            [e.target.name]: {
                ...formValuesSignUp[e.target.name],
                value: e.target.value,
                error: false,
                errorMessage: '',
            },
        });
    }

    function handleChangeLogin(e) {
        setInputesValuesLogin({
            ...formValuesLogin,
            mail: {
                ...formValuesLogin.mail,
                error: false,
                errorMessage: '',
            },
            password: {
                ...formValuesLogin.password,
                error: false,
                errorMessage: '',
            },

            [e.target.name]: {
                ...formValuesLogin[e.target.name],
                value: e.target.value,
                error: false,
                errorMessage: false,
            },
        });
    }

    function handleSubmitSignUp(e) {
        e.preventDefault();
        console.log('SignUp:');
        console.log(formValuesSignUp);

        signup({
            pseudo: formValuesSignUp.pseudo.value,
            mail: formValuesSignUp.mail.value,
            password: formValuesSignUp.password.value,
        }).then((data) => {
            if (data.error) {
                switch (data.error.name) {
                    case 'UserAlreadyExistsError': {
                        setInputesValuesSignUp((prevValue) => {
                            return {
                                ...prevValue,
                                pseudo: {
                                    ...prevValue.pseudo,
                                    error: true,
                                },
                                mail: {
                                    ...prevValue.mail,
                                    error: true,
                                    errorMessage:
                                        'Ce pseudo ou cette adresse mail sont déjà utilisés',
                                },
                            };
                        });
                        break;
                    }
                    case 'MissingParameterError': {
                        setInputesValuesSignUp((prevValue) => {
                            return {
                                ...prevValue,
                                pseudo: {
                                    ...prevValue.pseudo,
                                    error: true,
                                },
                                mail: {
                                    ...prevValue.mail,
                                    error: true,
                                },
                                password: {
                                    ...prevValue.password,
                                    error: true,
                                    errorMessage:
                                        'Veuillez remplir tous les champs',
                                },
                            };
                        });
                        break;
                    }
                }
            } else {
                setInputesValuesSignUp(initialValueSignUp);
                changement();
            }
        });
    }

    async function handleSubmitLogin(e) {
        e.preventDefault();
        console.log('Login:');
        console.log(formValuesLogin);
        const res = await login({
            mail: formValuesLogin.mail.value,
            password: formValuesLogin.password.value,
        });
        const payload = res;
        if (payload.status != 'success') {
            console.log(data.error.name);
            switch (data.error.name) {
                case 'MissingParameterError': {
                    setInputesValuesLogin((prevValue) => {
                        return {
                            ...prevValue,
                            mail: {
                                ...prevValue.mail,
                                error: true,
                            },
                            password: {
                                ...prevValue.password,
                                error: true,
                                errorMessage:
                                    'Veuillez remplir tous les champs',
                            },
                        };
                    });
                    break;
                }
                case 'UserNotFoundError':
                case 'InvalidIdentifiersError': {
                    setInputesValuesLogin((prevValue) => {
                        return {
                            ...prevValue,
                            mail: {
                                ...prevValue.mail,
                                error: true,
                            },
                            password: {
                                ...prevValue.password,
                                error: true,
                                errorMessage: 'Identifiant(s) incorrect(s)',
                            },
                        };
                    });
                    break;
                }
            }
        } else {
            loginContext(payload.data.token);
            setInputesValuesSignUp(formValuesLogin);
            navigate('/sheet');
        }
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
                                        value={formValuesSignUp.pseudo.value}
                                        onChange={handleChangeSignUp}
                                        required
                                        className={
                                            formValuesSignUp.pseudo.error
                                                ? 'error-bg'
                                                : ''
                                        }
                                    />
                                    <div className="auth-underline"></div>
                                    <label>Pseudo</label>
                                </div>
                                <div className="error-message">
                                    {formValuesSignUp.pseudo.errorMessage}
                                </div>
                            </div>
                            <div className="auth-form-row">
                                <div className="auth-input-data auth-mail">
                                    <input
                                        type="mail"
                                        name="mail"
                                        value={formValuesSignUp.mail.value}
                                        onChange={handleChangeSignUp}
                                        required
                                        className={
                                            formValuesSignUp.mail.error
                                                ? 'error-bg'
                                                : ''
                                        }
                                    />
                                    <div className="auth-underline"></div>
                                    <label>Mail</label>
                                </div>
                                <div className="error-message">
                                    {formValuesSignUp.mail.errorMessage}
                                </div>
                            </div>
                            <div className="auth-form-row">
                                <div className="auth-input-data">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formValuesSignUp.password.value}
                                        onChange={handleChangeSignUp}
                                        required
                                        className={
                                            formValuesSignUp.password.error
                                                ? 'error-bg'
                                                : ''
                                        }
                                    />
                                    <div className="auth-underline"></div>
                                    <label>Mot de passe</label>
                                </div>
                                <div className="error-message">
                                    {formValuesSignUp.password.errorMessage}
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
                                        value={formValuesLogin.mail.value}
                                        onChange={handleChangeLogin}
                                        required
                                        className={
                                            formValuesLogin.mail.error
                                                ? 'error-bg'
                                                : ''
                                        }
                                    />
                                    <div className="auth-underline"></div>
                                    <label>Mail</label>
                                </div>
                                <div className="error-message">
                                    {formValuesLogin.mail.errorMessage}
                                </div>
                            </div>
                            <div className="auth-form-row">
                                <div className="auth-input-data">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formValuesLogin.password.value}
                                        onChange={handleChangeLogin}
                                        required
                                        className={
                                            formValuesLogin.password.error
                                                ? 'error-bg'
                                                : ''
                                        }
                                    />
                                    <div className="auth-underline"></div>
                                    <label>Mot de passe</label>
                                </div>
                                <div className="error-message">
                                    {formValuesLogin.password.errorMessage}
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
