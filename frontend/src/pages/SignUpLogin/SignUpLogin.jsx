import { useState } from "react";
import "./sign-up-login.css";

function SignUpLogin() {
  const initialValueSignUp = {
    pseudo: "",
    mail: "",
    password: "",
  };
  const [formValuesSignUp, setInputesValues] = useState(initialValueSignUp);

  const [onSignUp, setOnSignUp] = useState(true);

  function handleChange(e) {
    setInputesValues({ ...formValuesSignUp, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formValuesSignUp);
  }
  function changement() {
    setOnSignUp(!onSignUp);
  }

  return (
    <>
    <div className="container-all">
      <div className={onSignUp ? "wrapper" : "wrapper active"}>
        <div className="form signup">
          <header onClick={changement}>Signup</header>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-row">
              <div className="input-data">
                <input
                  type="text"
                  name="pseudo"
                  value={formValuesSignUp.pseudo}
                  onChange={handleChange}
                  required
                />
                <div className="underline"></div>
                <label htmlFor="">Pseudo</label>
              </div>
            </div>
            <div className="form-row">
              <div className="input-data mail">
                <input
                  type="mail"
                  name="mail"
                  value={formValuesSignUp.mail}
                  onChange={handleChange}
                  required
                />
                <div className="underline"></div>
                <label htmlFor="">Mail</label>
              </div>
            </div>
            <div className="form-row">
              <div className="input-data">
                <input
                  type="password"
                  name="password"
                  value={formValuesSignUp.password}
                  onChange={handleChange}
                  required
                />
                <div className="underline"></div>
                <label htmlFor="">Mot de passe</label>
              </div>
            </div>
            <br></br>
            <div className="center-button">
              <button type="submit" className="submit-button">
                Valider
              </button>
            </div>
          </form>
        </div>

        <div className="form login">
          <header onClick={changement}>Login</header>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-row">
              <div className="input-data">
                <input type="text" required />
                <div className="underline"></div>
                <label htmlFor="">Pseudo</label>
              </div>
            </div>
            <div className="form-row">
              <div className="input-data">
                <input type="password" required />
                <div className="underline"></div>
                <label htmlFor="">Mot de passe</label>
              </div>
            </div>
            <br></br>
            <div className="center-button">
              <button type="submit" className="submit-button">
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

export default SignUpLogin;
