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
    //Ma fonction works reprend ce qu'il y'avait en HTML dur d'origine pour le faire en dynamique
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
    //Je crée ensuite cette boucle, qui me permet d'afficher les plusieures catégories
    const categorys = await getCategorys();
    categorys.forEach(category => {
        const btn = document.createElement("button");
        //Avec l'abréviation .toUpperCase() mes boutons sont donc écrit en majuscule / lettres capitales.
        btn.textContent = category.name.toUpperCase();
        //Me permet de trouver l'id de chaque catégorie
        btn.id = category.id;
        btn.classList.add("btn");
        filters.appendChild(btn);
    });
    //Je sélectionne donc tous mes boutons qui ont la classe CSS .filters et je les stocks dans une nouvelle variable qui aura comme nom : buttons.
    const buttons = document.querySelectorAll(".filters button");
    //Je créer donc ma fonction bouclé sur chaque boutons sélectionnés via la const buttons
    buttons.forEach(button => {
        button.addEventListener("click",(e) => {
            //Cette ligne me permet donc de récupérer l'ID du bouton sur lequel j'ai appuyé
            btnId = e.target.id;
            //Une fois que j'ai appuyé sur le bouton je décide donc de vidé la catégorie ce qui fais qu'on se retrouve avec une page totalement blanche
            gallery.innerHTML = ""
            //Si mon btnID n'est pas égale à 0 c'est que j'aurais cliqué soit sur les autres catégories soit sur Tous.
            //C'est ce code là qui va me permettre de faire mes 3 Catégories en reprennant à chaque fois L'image, le Texte ainsi que l'ID
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
            //Donc on reprend la théorie de dessus, si mon btnID est égal à 0 on a pas besoin de faire de changements ducoup on reprend juste notre fonction de base.
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

// Si je suis donc connecté en mode Admin, j'efface le texte sur Admin et modifie le texte sur le logout ce qui me permet d'afficher logout comme
// bouton de deconnexion. ensuite je fais une boucle pour montrer que si je suis déconnecté, je vais donc chercher par un getElementById ayant comme
// classe "div-admin" pour la stocker dans ma variable element qui ensuite se supprimera si j'ai donc le statut "déconnecté". J'ai également fait
// un tableau modifier pour récupérer l'autre classe "div-nonadmin" en supprimant la classe "see" et en ajoutant la classe "modif" pour modifier
// au niveau de la page d'accueuil mon index de connexion.

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

// 1ère Modale, création et ouverture + mise en place de la Method DELETE //
// Je crée une variable qui portera le nom modal défini initialiser par null ce qui va me permettre de stocker pour une fenêtre modale (popup) si elle est amenée
// a être déclenchée.
// Je créer une constante focusable selector qui contient donc les sélecteurs et des types d'éléments HTML qui sont considérés comme focusables donc auquel
// je peux naviguer dessus avec les touches préconfigurées.
// J'initialise ma variable comme focusables et je l'initialise à un tableau vide qui va me permettre de stocker les éléments qui pourront être "focus" à l'intérieur.
// Mon previouslyFocusedElement = null ceci fait référence à l'élément qui avais donc le focus avant l'ouverture de ma fenêtre modale
// Je sélectionne et stocke dans la constante step 1 et step2 l'id Step1 et Step2.

let modal = null
const focusableSelector= 'button, a, input, textarea'
let focusables = []
let previouslyFocusedElement = null
const step1 = document.querySelector("#step1")
const step2 = document.querySelector("#step2")

// Je crée donc une fonction asynchrone qui va obtiendra le paramètre e comme objet d'évènement.
// Je passe mon step1 en display ""block""" et mon step2 en display "none" pour avoir seulement que la 1ère modale.
// J'empêche le comportement par défaut de mon évènement avec e.preventDefault() / Exemple si demandé : Si mon évènement est un clic sur un lien, ceci m'empêchera de
// naviguer vers la nouvelle page.
// Je sélectionne la classe #modal1 pour la stockée dans ma variable modal.
// Je prend tout les éléments focusables qui sont à l'intérieur de ma fenêtre modale à l'aide du tableau "focusableSelector" et devienne désormais (focusables)
// previouslyFocusedElement cela stocke le dernier élément focus avant l'ouverture de ma modale, une fois que ma modale est fermée le focus est de retour sur le dernier
// élément.
// Une fois les premiers éléments fais je met ma modal en style display null pour réinistialiser l'affichage de ma modale par défaut.
// Après je supprime le aria-hidden qui signifie : Qu'elle est visible pour les lecteurs d'écran et les technologies d'assistance.
// J'attribut à ma modal le aria-modal avec la valeur true indiquant qu'elle est considérer ma fenêtre comme fenêtre modale.
// Un évènement au clique enfin pour fermé ma modale avec la sélection de la classe js-modal-close pour que ma croix puisse fermée la modale
// ainsi que la sélection de js-modal-stop pour arrêter la propagation de la modale. 

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

    //////////////////////////////////////////////////////////////////////////////////////////// 
    /////  DÉCRIRE LA CLOTURATION DE LA MODALE AVANT D'EXPLIQUER LA METHODE DELETE (L.334) /////
    ////////////////////////////////////////////////////////////////////////////////////////////

    // Je crée donc une constante response qui est égale à l'attente de la réponse du serveur localhost pour les api/works
    // Je le défini ensuite sous la constante works qui attend donc la réponse de response.json pour ensuite stocké les résultats dans la constante works
    // Je recrée la constante de ma gallerieModale où je selectionne la classe "photos"
    // Et je la vide avec un innerHTML pour me remettre la modale à jour.
    // Pour la fonction works.forEach((work) c'est exactement la même que celle du dessus je vais donc expliquer les quelques modifications qui ont eu lieux.
    // l'ajout d'une constante span et trash comportant un span et un i comme icône.
    // L'ajout des classlist ("fa-solid","fa-trash-can","position") pour le design de la poubelle et ainsi la position pour la mettre sur chaque images.
    // L'ajout de la classe ("photosadd") pour réglé la taille de l'image dans la modale
    // Le passage de figcaption en display none
    // figcaption.textContent = work.title : Ce qui permet donc de mettre à jour l'intérieur de l'élément figcaption pour qu'il corresponde au titre de l'image
    
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

    // Le fonctionnement de ma Method DELETE //
    // Je crée une fonction asynchrone deleteWorks()
    // Je récupère toute les poubelles par une sélections de toute les poubelles via la classe (".fa-trash-can")
    // Je crée une fonction asynchrone d'évènement au click sur les poubelles (trash)
    // Il va donc au clique récupérer l'id de la poubelle, gérer le token en regardant si les autorisations lui sont permises et initié la method DELETE
    // Derrière, la requête est envoyée à l'api a l'aide de await fetch.
    // La réponse de ma requête sera lue en JSON avec la ligne const data = await response.json();
    // Si la réponse est OK donc avec l'affichage 200 mon message de confirmations era affiché dans ma console sinon j'aurais le droit à un message d'erreur.
    // Une fois que tout ça est fini, ma page sera raffraîchie à l'aide de window.location.reload();
    // Je n'oublie pas d'appellé ma fonction deleteWorks() à la fin pour déclencher la fonction de suppression une fois que la page est chargée.

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
                    openModal() ;
                    } catch (error) {
                    console.error("Erreur lors de la suppression :", error);
                }
                window.location.reload();
            });
        });
    }
    deleteWorks()
    const button = document.querySelector('.photoButton')
    button.addEventListener('click', nextModale)
}   

    // 2ème MODALE // 
    // Je recrée donc ma fonction asynchrone, et je lui set step1 en display none cette fois ci et step2 en display block.
    // Mon querySelector('a[href="#modal1"]') est celui qui comporte la flèche de retour, donc si je clique dessus je reviendrais sur la première modale.
    // Le deuxième querySelector est donc encore la croix qui se situe en haut à droite, ce qui me permet de fermer la modale.
    // Et le troisième et dernier querySelector est ce qui me permet de stopper la propagation de mon évènement.

    const nextModale = async function () {
    step1.style.display ="none"
    step2.style.display ="block"
    modal.addEventListener('click', closeModal)
    document.querySelector('a[href="#modal1"]').addEventListener('click', openModal);
    document.querySelector('.js-modal-close2').addEventListener('click', closeModal)
    document.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    
    // Je passe response et categories, même principe que les constantes mentionnées un peu plus haut
    // Je fais une fonction avec ma categories pour ajouter des value avec des id et faire en sorte mes 3 choix soient égaux à mes catégories.

    const response = await fetch('http://localhost:5678/api/categories');
    const categories = await response.json();
    const divCategorie = document.querySelector(".categorie")
    divCategorie.innerHTML= ""
    categories.forEach((work) => {
        const option = document.createElement("option");
        option.setAttribute("value", work.id)
        option.innerText = work.name
        divCategorie.appendChild(option)
    })

    // Je stock ensuite tout ce qui va me permettre de prévisualiser mon image
    // donc : 

    const labelFile = document.querySelector('.label-file');
    const fileInput = document.querySelector('#file');
    const previewImage = document.querySelector('#previewImage');
    const sizeSvg2 = document.querySelector('.size-svg2');
    const format = document.querySelector('.center4');
    const labeladd = document.querySelector('.center6');
    const backgroundImage = document.querySelector('.background img');

    // Dès que je clic sur Ajouter Photo, cela me permet donc d'ouvrir la fenêtre de sélection de fichier
    // Et donc une fois que le fichier est sélectionné, tout ce qui était positionné avant passe en display none. Mis à part le background.

    labelFile.addEventListener('click', () => {
    fileInput.click();
    });
    fileInput.addEventListener('change', () => {
    previewImageFunction();
    labelFile.style.display = 'none';
    sizeSvg2.style.display = 'none';
    format.style.display = 'none';
    labeladd.classList.add('pdtop');
    backgroundImage.style.display = 'flex';
    });

    // Fonction pour prévisualiser l'image
    // A nouveau, je recrée ma constante previewImageFunction qui va me permettre de faire une fonciton fleché derrière
    // Où je récupère mon fichier sélectionné pour le stocké dans une constante appellée selectedFile
    // Si mon fichier est sélectionné, je crée une nouvelle instance qui est nommée FileReader ce qui me permet de lire le contenu du fichier
    // Ensuite mon reader.onload définit un gestionnaire d'évènements qui va se déclenchera lorsque la lecture du fichier est terminée
    // et cela me met donc à jour la source src de mon élément de prévisualisation donc previewImage avec l'url de mon fichier sélectionné
    // donc e.target.result
    // Une fois tout cela fais, le contenu de mon fichier en tant que URL de données sera lu et étant donner qu'il sera encodé en "base64"
    // il pourra directement s'afficher dans une balise <img>
    // Et j'indique comme quoi je veux que l'élément de prévisualisation de l'image soit bien affiché à l'écran donc display : flex.

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

    // Fonction METHOD POST //
    // Je crée ma fonction asynchrone
    // Je récupère mon 2ème & 3ème bouttons avec leurs classes .photoButton2 .photoButton3 
    // Je sélectionne 3 ID, "file", "title" ,"cat" pour pouvoir Séléctionné les fichiers, Saisir le titre, Sélectionné la catégorie.
    // Je recrée à nouveau une nouvelle fonction qui indique que si mes 3 champs sont remplis mon 2ème bouton (Donc celui qui est grisé)
    // passe en display none, et mon 3ème bouton (Donc celui qui est vert) en display flex, sinon ce sera l'inverse.
    // Ma fonction [fileInput, titleInput, categorySelect].forEach(input => { me permet donc le déclenchement de la fonction "toggleButtons"
    // pour vérifer au cas où il y'aurais eu des modifications dans les champs et donc qu'il faudrait rechangé les boutons en fonction de.

    async function createWork() {
        const photoButton2 = document.querySelector(".photoButton2");
        const photoButton3 = document.querySelector(".photoButton3");
        console.log(photoButton2);
        const fileInput = document.getElementById("file");
        const titleInput = document.getElementById("title");
        const categorySelect = document.getElementById("cat");
        function toggleButtons() {
            if (fileInput.files.length && titleInput.value && categorySelect.value) {
                photoButton2.style.display = "none";
                photoButton3.style.display = "block";
            } else {
                photoButton2.style.display = "flex";
                photoButton3.style.display = "none";
            }
        }
        [fileInput, titleInput, categorySelect].forEach(input => {
            input.addEventListener('input', toggleButtons);
        });

    // Lorsque je clique sur mon photoButton3 (Donc mon bouton vert)
    // Si les champs ne sont pas remplis il faut les remplir, (Je ne suis pas censé avoir cet erreur car si ça passe au vert c'est que les 3 le sont)
    // Je crée une constante formData qui sera utilisé pour l'envoie de données de formulaire via des requêtes HTTP
    // Je reprend sur ma doc Swagger, je dois avoir 3 rubriques, donc image, title, category c'est à dire que mon image, mon titre, et ma catégorie représenteront
    // 3 clées. Ensuite je récupère mon token pour savoir si j'ai les accès requis pour mettre une image. Donc la vérification s'effectue de nouveaux
    // donc constante Init pour créer un objet d'initialisation pour la requête HTTP en y comprenant dedans la méthode POST.
    // Ensuite je try-catch pour voir les potentielles erreurs lors de l'exécution de ma requête
    // Donc j'effectue une requête HTTP POST vers l'URL spécifiée avec les options d'initialisation donc le init
    // Ma constante data est par la suite crée en attendant la réponse de cette requête et le statut de la réponse de mes données.
    // Si ma response n'est pas ok, donc que la plage de mon statut HTTP ne se situe pas dans les plages 200-299 le script s'arrêtera et m'affichera
    // ("La création n'a pas fonctionné", response.status, data);
    // En revanche, si cela a fonctionné, j'aurais donc : ("La création a réussi, nouvelle data :", data);
    // Une fois que le changement est pris en compte je raffraîchis donc la page, et on pourra donc voir que notre image est bien enregistrée
    // Et sur la modale et sur l'arrière plan.

        photoButton3.addEventListener("click", async (e) => {
            e.preventDefault();
            if (!fileInput.files.length || !titleInput.value || !categorySelect.value) {
                console.log("Veuillez sélectionner une photo, remplir le titre et sélectionner une catégorie.");
                return;
            }
            const formData = new FormData();
            formData.append("image", fileInput.files[0]);
            formData.append("title", titleInput.value);
            formData.append("category", categorySelect.value);
            console.log("Essaie",formData);
            const token = window.localStorage.getItem("token");
            const init = {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            };
            try {
                const response = await fetch("http://localhost:5678/api/works", init);
                console.log(response);
                const data = await response.json();
                console.log("Réponse POST :", response.status, data);
                if (!response.ok) {
                    console.log("La création n'a pas fonctionné", response.status, data);
                    return;
                }
                console.log("La création a réussi, nouvelle data :", data);
                openModal();
                window.location.reload();
            } catch (error) {
                console.error("Erreur lors de la création :", error);
            }
        });
    }
    createWork();
}

    //////////////////////////////////////////////////////////////////////////////////////////// 
    /////                                   ICI                                            /////
    ////////////////////////////////////////////////////////////////////////////////////////////

    // Je crée donc ma constante qui portera closeModal avec une fonction d'évènement
    // Cette fonction ne sera utilisé si ma modale est strictement null ducoup je la retourne
    // Et si mon dernier élément focus est stictement inégale à null donc que j'ai bien décidé de fermer ma modale.
    // Je reprend la base de l'ouverture de ma modale les changements c'est que aria-hidden passera en true et sera rajouté 
    // Tandis que mon aria modal sera supprimer ainsi que mon eventListener sur le click sera supprimé aussi ainsi que tout les EventListener.
    // Je redéfinis comme quoi ma modal est = à null et je demande le vidage de ma gallerieModale avec le .innerHTML = à "".

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

    // La fonction qui détermine la propagation totale de mon évènement donc qui permet de la stoppée

const stopPropagation = function (e) {
    e.stopPropagation()
}

    // Ce qui me permet de gérer la navigation au clavier à l'intérieur de la fenêtre modale
    // Tab & Shift enfoncés en même temps permettent la navigation dans la modale ce qui permet le bon fonctionnement du clavier à l'intérieur.
    // Mon let index détermine l'index de l'élément qui a actuellement le focus à l'intérieur de la fenêtre modale. 
    // Elle utilise findIndex() pour rechercher cet élément dans le tableau focusables, qui contient tous les éléments focusables de la fenêtre modale.
    // Mon premier if ajuste l'index en fonction de la touche pressée, Si ma touche Shift est enfoncée en même temps que ma touche Tab je vais donc naviguer en
    // arrière ce qui fais que mon index est décrémenté, sinon je me dirige vers l'avant et donc incrémenté.
    // Mon deuxième if indique si mon index dépasse mon tableau focusables.lenght c'est que j'aurais atteint le dernier élément et donc mon index sera par la suite
    // réinistialisé à 0.
    // Mon troisième if indique que si mon index est inférieur à 0 cela signifie que j'ai atteint le premier élément que j'avais en focus et que je souhaite revenir
    // au dernier dans ce cas mon index est réinistialiser à la longueur de mon tableau -1.
    // Et mon focusables[index].focus() Cela me permet de naviguer d'un élément à l'autre à l'intérieur de ma boôte modale avec les touches de tabulation et de shift
    // + tabulations.

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

    // Ici c'est donc le bouton modifier qui est comporté sur la page d'accueuil qui me permet d'ouvrir la boîte modale au clique.

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

    // Ici il y'a donc 2 évènement, le premier me permet de fermé la modale si j'appuie sur "Escape" où avec l'abréviation "Esc"
    // Et rester focus au niveau de ma modale avec la touche "Tab" mais à condition que ma modale soit strictement inégale à null sinon
    // cela ne fonctionnera pas.

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e)
    }
})
