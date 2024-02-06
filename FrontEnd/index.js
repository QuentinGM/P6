//Je vérifie que j'ai lancer mon backend avec npm start//
//Être à la racine du projet//

/**Création de ma variable**/
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

//J'affiche mes boutons par catégories 

async function getCategorys() {
    const response = await fetch ("http://localhost:5678/api/categories");
    return await response.json();
}
getCategorys()

//Je filtre en cliquant sur les boutons les plusieurs catégories possibles

async function filterCategory() {
    const response =  await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    works.forEach((work) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = work.imageUrl;
        figcaption.textContent = work.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
    console.log(works)
    const categorys = await getCategorys();
    console.log(categorys);
    categorys.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name.toUpperCase();
        btn.id = category.id;
        btn.classList.add("btn");
        filters.appendChild(btn);
    });
    const buttons = document.querySelectorAll(".filters button");
    console.log("toto", buttons)
    buttons.forEach(button => {
        button.addEventListener("click",(e) => {
            btnId = e.target.id;
            gallery.innerHTML = ""
            if (btnId != "0") {
                const appartementTriCategory = works.filter ((work) => {
                    return work.categoryId == btnId;
                });
                console.log(btnId, appartementTriCategory);
                appartementTriCategory.forEach((work) => {
                    const figure = document.createElement("figure");
                    const img = document.createElement("img");
                    const figcaption = document.createElement("figcaption");
                    img.src = work.imageUrl;
                    figcaption.textContent = work.title;
                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    gallery.appendChild(figure);
                });
            }
            else {
                works.forEach((work) => {
                    const figure = document.createElement("figure");
                    const img = document.createElement("img");
                    const figcaption = document.createElement("figcaption");
                    img.src = work.imageUrl;
                    figcaption.textContent = work.title;
                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    gallery.appendChild(figure);
                });
            }
            console.log(btnId)
    });
    })
}
filterCategory()

// Si je suis connecté à ma page web

const loged = window.sessionStorage.loged;
const admin = document.querySelector("header nav .admin");
const logout = document.querySelector("header nav .logout");

if (loged == "true") {
    admin.textContent = "";
    logout.textContent = "logout";
    logout.addEventListener("click",()=>{
        window.sessionStorage.loged = false;
    })
    const element = document.getElementById("div-admin");
    element.remove();
    const modifier = document.getElementById("div-nonadmin");
    modifier.classList.remove("see");
    modifier.classList.add("modif");
}

// Modale

let modal = null
const focusableSelector= 'button, a, input, textarea'
let focusables = []
let previouslyFocusedElement = null
const step1 = document.querySelector("#step1")
const step2 = document.querySelector("#step2")

const openModal = async function (e) {
    step1.style.display ="block"
    step2.style.display ="none"
    e.preventDefault()
    modal = document.querySelector("#modal1");
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusedElement = document.querySelector(':focus')
    focusables[0].focus()
    modal.style.display = null
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal','true');
    modal.addEventListener('click', closeModal)
    document.querySelector('.js-modal-close').addEventListener('click', closeModal)
    document.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

    //Reponse
    const response =  await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    const gallerieModale = document.querySelector(".photos")
    gallerieModale.innerHTML= ""
    works.forEach((work) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        const span = document.createElement("span");
        const trash = document.createElement("i");
        trash.classList.add("fa-solid","fa-trash-can","position")
        img.classList.add("photosadd");
        figcaption.classList.add("none");
        trash.id = work.id
        img.src = work.imageUrl;
        figcaption.textContent = work.title;
        figure.appendChild(span);
        figure.appendChild(img);
        span.appendChild(trash);
        figure.appendChild(figcaption);
        gallerieModale.appendChild(figure);
    });
    async function deleteWorks() {
        const trashAll = document.querySelectorAll(".fa-trash-can")
        trashAll.forEach(trash => {
            trash.addEventListener("click", async (e) => {
                e.preventDefault();
                const id = trash.id;
                const token = window.localStorage.getItem("token")
                const init = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': '*/*',
                        "Authorization": `Bearer ${token}`
                    }
                };
                try {
                    const response = await fetch(`http://localhost:5678/api/works/${id}`, init);
                    const data = await response.json();
                    console.log("Réponse DELETE :", response.status, data);

                    if (!response.ok) {
                        console.log("Le delete ne fonctionne pas", response.status, data);
                        return;
                    }
                    console.log("Le delete a réussi, nouvelle data :", data);
                    openModal();
                } catch (error) {
                    console.error("Erreur lors de la suppression :", error);
                }
            });
        });
    }
    deleteWorks()
    const button = document.querySelector('.photoButton')
    button.addEventListener('click', nextModale)
}



const nextModale = async function () {
    step1.style.display ="none"
    step2.style.display ="block"
    modal.addEventListener('click', closeModal)
    document.querySelector('a[href="#modal1"]').addEventListener('click', openModal);
    document.querySelector('.js-modal-close2').addEventListener('click', closeModal)
    document.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

    //Reponse
    const response = await fetch('http://localhost:5678/api/categories');
    const categories = await response.json();
    const divCategorie = document.querySelector(".categorie")
    divCategorie.innerHTML= ""
    categories.forEach((work) => {
        const option = document.createElement("option");
        option.setAttribute("data-id", work.id)
        option.innerText = work.name
        divCategorie.appendChild(option)
    })
    const labelFile = document.querySelector('.label-file');
    const fileInput = document.querySelector('#file');
    const previewImage = document.querySelector('#previewImage');
    const sizeSvg2 = document.querySelector('.size-svg2');
    const center4 = document.querySelector('.center4');
    const center6 = document.querySelector('.center6');
    const backgroundImage = document.querySelector('.background img');
    labelFile.addEventListener('click', () => {
    fileInput.click();
    });
    fileInput.addEventListener('change', () => {
    previewImageFunction();
    // Appliquer les modifications après avoir sélectionné un fichier
    labelFile.style.display = 'none';
    sizeSvg2.style.display = 'none';
    center4.style.display = 'none';
    center6.classList.add('test5');
    backgroundImage.style.display = 'flex';
    });
    // Fonction pour prévisualiser l'image
    const previewImageFunction = () => {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
        previewImage.style.display = 'flex';
    };
    }
    // Afficher la previewImage une fois que l'image est sélectionnée
// Appel initial de la fonction de prévisualisation de l'image
previewImageFunction();
}







const closeModal = function (e) {
    if (modal === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    e.preventDefault()
    const gallerieModale = document.querySelector(".photos")
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal)
    document.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    document.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
    gallerieModale.innerHTML = ""
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const focusInModal = function (e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    if (e.shiftkey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e)
    }
})
