//Variables pour indiquer les champs de connexion//
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const messageErreur = document.querySelector(".login p");

//Récupérer les utilisateurs
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userEmail = email.value
    const userPassword = password.value
    const login = {
        email : userEmail,
        password : userPassword,
    }
    const user = JSON.stringify(login)
    const reponse = await fetch("http://localhost:5678/api/users/login",{
      method: "POST", // ou 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body:user
    });
    const readExperience = await reponse.json()
    if (readExperience?.token) {
        window.sessionStorage.loged = true;
        window.localStorage.setItem("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4", readExperience.token);
        window.location.href = "index.html";
    } 
    else {
      //message d'erreur
      messageErreur.textContent =
      "Votre email ou votre mot de passe est incorrect";
    }

    console.log(readExperience)
})
