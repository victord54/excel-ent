import { useCallback, useContext, useState } from "react";
import "./profile.css";
import { AuthContext } from "../../../contexts/AuthContext";
import boutonModifier from "../../../assets/bouton-modifier.png";
import boutonAnnuler from "../../../assets/bouton-annuler.png";
import boutonValider from "../../../assets/bouton_valider.png";
import { editPassword, editProfile } from "../../../services/api-service";

// TODO : essayer de trouver pq ça prend un peu de temps pour se log (5 sec)
export default function Profile(){

    const { user, setUser } = useContext(AuthContext);

    const formDefaultValue = {
        pseudo: {
            value: user.usr_pseudo,
            error: false,
            errorMessage: '',
            inEdit: false
        },
        mail: {
            value: user.usr_mail,
            error: false,
            errorMessage: '',
            inEdit: false
        }
    }

    const passwordFormDefaultValue = {
        inEdit: false,
        old_pwd: {
            value: '',
            error: false,
            errorMessage: ''
        },
        new_pwd: {
            value: '',
            error: false,
            errorMessage: ''
        },
        confirm_pwd: {
            value: '',
            error: false,
            errorMessage: ''
        }
    }

    const [form, setForm] = useState({...formDefaultValue});

    const [ passwordForm, setPasswordForm ] = useState({...passwordFormDefaultValue});

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: {
                ...form[e.target.name],
                value: e.target.value,
                error: false,
                errorMessage: ''
            }
        });
    };

    const handleEditing = (e, name) => {
        e.preventDefault();

        if(form[name].inEdit){
            editProfile({ mail: form.mail.value, pseudo: form.pseudo.value, pwd: form.pwd }).then((data) => {
                if(data.error){
                    setForm({
                        ...form,
                        [name]: {
                            ...form[name],
                            error: true,
                            errorMessage: data.error.message,
                            inEdit: true
                        }
                    })
                }else{
                    setUser(data.user);
                    setForm({...form,
                        [name]: { ...form[name], inEdit: !form[name].inEdit, error: false, errorMessage: ''}
                    });
                }
            });
        }else{
            setForm({...form,
                [name]: { ...form[name], inEdit: !form[name].inEdit, error: false, errorMessage: ''}
            });
        }
    }

    const handleQuitEditing = (e, name) => {
        e.preventDefault();
        setForm(
            {
                ...form,
                [name]: {
                    ...formDefaultValue[name]
                }
            }
        )
    }

    const handlePasswordEditing = (e) => {
        e.preventDefault;
        
        if(passwordForm.isEditing){
            editPassword({ old_password: passwordForm.old_pwd.value, new_password: passwordForm.new_pwd.value }).then((data) => {
                if(data.error){
                    if(data.error.name === "InvalidIdentifiersError"){
                        setPasswordForm((prevValue) => {
                            return {
                                ...prevValue,
                                old_pwd: {
                                    ...prevValue.old_pwd,
                                    error: true,
                                    errorMessage: data.error.message
                                }
                            }
                        });
                    }else if(data.error.name === "MissingParameterError"){
                        setPasswordForm((prevValue) => {

                            const { old_pwd, new_pwd, confirm_pwd } = prevValue;
                            
                            const errors = {
                                old_pwd: old_pwd.value.length === 0,
                                new_pwd: new_pwd.value.length === 0,
                                confirm_pwd: confirm_pwd.value.length === 0
                            }

                            return {
                                ...prevValue,
                                old_pwd: { ...old_pwd, error: errors.old_pwd, errorMessage: errors.old_pwd ? 'Veuillez renseigner votre mot de passe actuel' : '' },
                                new_pwd: { ...new_pwd, error: errors.new_pwd, errorMessage: errors.new_pwd ? 'Veuillez renseigner votre nouveau mot de passe' : '' },
                                confirm_pwd: { ...confirm_pwd, error: errors.confirm_pwd, errorMessage: errors.confirm_pwd ? 'Veuillez confirmer votre nouveau mot de passe' : '' }
                            }
                        });
                    }
                }else{
                    setPasswordForm({...passwordFormDefaultValue});
                }
            });
        }else{
            setPasswordForm((prevValue) => {
                return {
                    ...prevValue,
                    isEditing: !prevValue.isEditing
                }
            });
        } 
    }

    const quitPasswordEditing = (e) => {
        e.preventDefault;
        setPasswordForm({...passwordFormDefaultValue});
    }

    const confirmPasswordError = useCallback((prevValue, inputValue) => {
        return prevValue.length !== 0 ?
            prevValue !== inputValue
            :
            false;
    }, []);

    const handlePasswordChange = (e) => {
        const inputName = e.target.name;
        const inputValue = e.target.value;
    
        switch(inputName){
            case "old_pwd":
                setPasswordForm((prevValue) => {
                    return {
                        ...prevValue,
                        old_pwd: {
                            value: inputValue,
                            error: false
                        }
                    }
                });
                break;
            case "new_pwd":
                setPasswordForm((prevValue) => {
                    return {
                        ...prevValue,
                        new_pwd: {
                            value: inputValue,
                            error: confirmPasswordError(prevValue.confirm_pwd.value, inputValue)
                        },
                        confirm_pwd:{
                            ...prevValue.confirm_pwd,
                            error: confirmPasswordError(prevValue.confirm_pwd.value, inputValue)
                        }
                    }
                });
                break;
            case "confirm_pwd":
                setPasswordForm((prevValue) => {
                    return {
                        ...prevValue,
                        confirm_pwd: {
                            value: inputValue,
                            error: prevValue.new_pwd.value !== inputValue,
                            errorMessage: (prevValue.new_pwd.value !== inputValue) ? "Les mots de passe ne sont pas identiques" : ""
                        },
                        new_pwd:{
                            ...prevValue.new_pwd,
                            error: prevValue.new_pwd.value !== inputValue,
                        }
                    }
                });
                break;
        }
    }

   
    return (
        <>
            <div id="profile">
                <div className="illot-central">
                    <div className="illot-central-content">
                        <div style={{ margin: '0 2.5em' }}>
                            <h2>Informations du profil :</h2>
                            <br />
                            <div className="input-wrapper">
                                <label htmlFor="pseudo">Pseudo :</label>
                                <div className="inputfield-wrapper">
                                    <input name="pseudo" type="text" value={form.pseudo.value} disabled={!form.pseudo.inEdit} onChange={handleChange} className={form.pseudo.error ? "input-error" : ""}/>
                                    <button title="Modifier le pseudo" onClick={(e) => handleEditing(e, "pseudo")}><img src={form.pseudo.inEdit ? boutonValider : boutonModifier}/></button>
                                    
                                    {form.pseudo.inEdit ? 
                                    <button title="Annuler la modification" onClick={(e) => handleQuitEditing(e, "pseudo")}><img src={boutonAnnuler} width="15px"/></button> : null}
                                </div>
                                <div className="error">{form.pseudo.errorMessage}</div>
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="mail">Mail :</label>
                                <div className="inputfield-wrapper">
                                    <input name="mail" type="text" value={form.mail.value} disabled={!form.mail.inEdit} onChange={handleChange} className={form.mail.error ? "input-error" : ""}/>
                                    <button title="Modifier le mail" onClick={(e) => handleEditing(e, "mail")}><img src={form.mail.inEdit ? boutonValider : boutonModifier} width="15px"/></button>
                                    
                                    {form.mail.inEdit ? 
                                    <button title="Annuler la modification" onClick={(e) => handleQuitEditing(e, "mail")}><img src={boutonAnnuler} width="15px"/></button> : null}
                                </div>
                                <div className="error">{form.mail.errorMessage}</div>
                            </div>
                            {
                                !passwordForm.isEditing ? 
                                <div className="input-wrapper">
                                    <label htmlFor="pwd">Mot de passe :</label>
                                    <div className="inputfield-wrapper">
                                        <input name="pwd" type="password" disabled value={"*********************"} className="flouter"/>
                                        <button onClick={handlePasswordEditing}><img src={boutonModifier} width="15px"/></button>
                                    </div>
                                </div> 
                                : 
                                <div className="wrapper-boutons-passwords">
                                    <div className="input-wrapper">
                                        <label htmlFor="pwd">Ancien mot de passe :</label>
                                        <div className="inputfield-wrapper">
                                            <input name="old_pwd" type="password" value={passwordForm.old_pwd.value} onChange={(e) => handlePasswordChange(e)} className={passwordForm.old_pwd.error ? "input-error" : ""}/>
                                        </div>
                                        <div className="error">{passwordForm.old_pwd.errorMessage}</div>
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="pwd">Nouveau de passe :</label>
                                        <div className="inputfield-wrapper">
                                            <input name="new_pwd" type="password" value={passwordForm.new_pwd.value} onChange={handlePasswordChange} className={passwordForm.new_pwd.error ? "input-error" : ""}/>
                                        </div>
                                        <div className="error">{passwordForm.new_pwd.errorMessage}</div>
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="pwd">Confirmer le mot de passe :</label>
                                        <div className="inputfield-wrapper">
                                            <input name="confirm_pwd" type="password" value={passwordForm.confirm_pwd.value} onChange={handlePasswordChange} className={passwordForm.new_pwd.error ? "input-error" : ""}/>
                                        </div>
                                        <div className="error">{passwordForm.confirm_pwd.errorMessage}</div>
                                    </div>
                                    <div className="password-buttons">
                                        <button className="bouton-password-edit bouton-password-edit-annuler" onClick={quitPasswordEditing}><img src={boutonAnnuler} width="25px"/></button>
                                        <button className="bouton-password-edit bouton-password-edit-valider" onClick={handlePasswordEditing}><img src={boutonValider} width="25px"/></button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
