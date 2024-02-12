  //Variables pour indiquer les champs de connexion//

const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const messageErreur = document.querySelector(".login p");

  // Récupérer les utilisateurs

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userEmail = email.value
    const userPassword = password.value
    const login = {
        email : userEmail,
        password : userPassword,
    }

    // Ma const user convertit mon objet login en chaîne JSON et stocke mon résultat dans cette constante
    // J'effectue une requête POST vers mon URL spécifiée avec mes options spécifiées également.
    // Donc ensuite j'attend la réponse de ma requête
    // Si mon token existe bien dans l'objet JSON appartenant ci-dessus, je suis donc considéré comme "connecté" et ma page me redirige sous index.html
    // mais avec les permissions d'administation. Sinon, mon email où mon mot de passe est incorrect.

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
        window.localStorage.setItem("token", readExperience.token);
        window.location.href = "index.html";
    } 
    else {
      //message d'erreur
      messageErreur.textContent =
      "Votre email ou votre mot de passe est incorrect";
    }

    console.log(readExperience)
})
