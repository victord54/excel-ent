import { useContext, useState } from "react";
import "./profile.css";
import { AuthContext } from "../../../contexts/AuthContext";
import boutonModifier from "../../../assets/bouton-modifier.png"
import { editProfile } from "../../../services/api-service";

export default function Profile(){

    const { user, setUser } = useContext(AuthContext)

    const [form, setForm] = useState({
        pseudo: {
            value: user.usr_pseudo,
            inEdit: false
        },
        mail: {
            value: user.usr_mail,
            inEdit: false
        }
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: {
                ...form[e.target.name],
                value: e.target.value
            }
        });
    }

    const handleEditing = (e, name) => {
        e.preventDefault();

        if(form[name].inEdit){
            editProfile({ mail: form.mail.value, pseudo: form.pseudo.value, pwd: form.pwd }).then((data) => {
                if(data.error){
                    
                }else{
                    setUser(data.user);
                    setForm({
                        ...form,
                        [name]: {
                            ...form[name],
                            inEdit: !form[name].inEdit
                        }
                    })
                }
            });
        }else{
            setForm({
                ...form,
                [name]: {
                    ...form[name],
                    inEdit: !form[name].inEdit
                }
            })
        }

        
    }

    return (
        <>
            <div id="profile">
                <div className="illot-central">
                    <div className="illot-central-content">
                        <div style={{margin: "0 2.5em"}}>
                            <h2>Informations du profil :</h2>
                            <br/>
                            <div className="input-wrapper">
                                <label htmlFor="pseudo">Pseudo :</label>
                                <div className="inputfield-wrapper">
                                    <input name="pseudo" type="text" value={form.pseudo.value} disabled={!form.pseudo.inEdit} onChange={handleChange}/>
                                    <button title="Modifier le pseudo" onClick={(e) => handleEditing(e, "pseudo")}><img src={boutonModifier}/></button>
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="mail">Mail :</label>
                                <div className="inputfield-wrapper">
                                    <input name="mail" type="text" value={form.mail.value} disabled={!form.mail.inEdit} onChange={handleChange}/>
                                    <button title="Modifier le mail" onClick={(e) => handleEditing(e, "mail")}><img src={boutonModifier} width="15px"/></button>
                                </div>
                                
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="pwd">Mot de passe :</label>
                                <div className="inputfield-wrapper">
                                    <input name="pwd" type="password" disabled value={"*********************"} className="flouter"/>
                                    <button><img src={boutonModifier} width="15px"/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}