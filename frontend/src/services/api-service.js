export function signup({pseudo, mail, password}){
    return fetch("http://localhost:8888/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usr_pseudo: pseudo,
        usr_mail: mail,
        usr_pwd: password,
      }),
    })
    .then((response) => response.json())
    .catch((error) => {
        console.error("Error:", error);
    });
}