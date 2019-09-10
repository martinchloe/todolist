// Initialisation des variables "globales" de l'application
/*
MODELE DE DONNEES
[{label:"texte","done":false},
{label:"texte","done":false}]
*/
let tododatas = [];
const addform = document.getElementById("addform");
const list = document.getElementById("list");
const donefilter = document.getElementById("donefilter");
let doneonly = false;
init(); //démarrage de l'application

function init() {
  // Chargement des données locales (dans le localstorage du navigateur)
  loadData();
  // Mise à jour de l'HTML
  updateHTML();
  // Ajout des écouteurs d'événements
  addform.addEventListener("submit", addTaskHandler);
  list.addEventListener("click", handleClick);
  donefilter.addEventListener("change", handleFilter);
}

function handleFilter(ev) {
  doneonly = ev.target.checked;
  updateHTML();
}

function updateHTML() {
  if (tododatas.length <= 0) {
    // SI il n'y a rien dans la liste (<= 0 éléments) on vide l'html et on sort de la fonction avec return.
    list.innerHTML = "";
    return;
  }
  let todoHTML = "";
  //Boucle sur les éléments du tableau tododatas
  /*
  let displaytododata = tododatas;

  if(doneonly){
    displaytododata = displaytododata.filter(el => !el.done);
  };

  displaytododata.forEach((el, index) => {
  */
  (doneonly ? tododatas.filter(el => !el.done) : tododatas).forEach(
    (el, index) => {
      //Pour chaque élément on ajoute la liste html avec les bonnes valeurs
      todoHTML += `<li id="${index}"><input type='checkbox' name='' id='' 
      ${el.done ? "checked" : ""}
      data-action="check" >${
        el.label
      } <button data-action="delete">delete</button></li>`;
    }
  );
  // On insère le nouvel HTML dans le DOM
  list.innerHTML = todoHTML;
}

function addTaskHandler(ev) {
  // On bloque le comportement par défaut(reload de la page)
  ev.preventDefault();
  //On récupère la valeur de l'input avec le nom "ntache"
  const newlabel = ev.target.elements["ntache"].value;
  // On insère un nouvel objet dans notre tableau tododatas
  tododatas = [{ label: newlabel, done: false }, ...tododatas];
  // On vide le formulaire
  ev.target.reset();

  // On sauvegarde le tableau mis à jour dans le localstorage
  saveData();
  // On met à jour l'HTML
  updateHTML();
}

function handleClick(ev) {
  //On vérifie la présence et la valeur de l'attribut data-action sur l'élément cliqué
  if (ev.target.getAttribute("data-action") === "delete") {
    // on enlève l'élément du tableau tododatas avec l'index retrouvé
    tododatas.splice([ev.target.parentElement.id], 1);
    // On sauve les changements dans le localstorage !
    saveData();
  }

  // On détecte le click sur un élément avec un data-action spécifique pour le check
  // PS: data-action est un attribut "custom"
  if (ev.target.getAttribute("data-action") === "check") {
    //On vérifie et inverse la valeur de done sur l'élément
    if (tododatas[ev.target.parentElement.id].done === true) {
      tododatas[ev.target.parentElement.id].done = false;
    } else {
      tododatas[ev.target.parentElement.id].done = true;
    }
    // sauvegarde du changement
    saveData();
  }
  //mise à jour de l'html
  updateHTML();
}

function saveData() {
  // Sauvegarde dans le localStorage avec transformation du tableau d'objet en chaine de caractères
  localStorage.setItem("savedTodoData", JSON.stringify(tododatas));
}

function loadData() {
  // Récupération de la chaine de caractères depuis le localstorage et conversion en tableau d'objets
  let loaddatas = JSON.parse(localStorage.getItem("savedTodoData"));
  if (loaddatas != null) {
    tododatas = loaddatas;
  }
}
