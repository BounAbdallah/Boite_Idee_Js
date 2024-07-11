// Sélectionnez les éléments HTML
const ideaForm = document.getElementById("idea-form");
const ideasList = document.getElementById("ideas-list");
const messageDiv = document.getElementById("message");
const messageSucces = document.getElementById("messageSucces");

// Charger les idées à partir de localStorage
let ideas = JSON.parse(localStorage.getItem("ideas")) || [];

// Valider le titre
function validerTitre() {
  const title = document.getElementById("idea-title").value;
  const titleError = document.getElementById("titleError");
  titleError.innerHTML = "";

  if (title === "" || title.length < 3 || title.length > 50) {
    titleError.innerHTML = "Veuillez entrer un titre entre 3 et 50 caractères";
    return false;
  }
  return true;
}

// Valider la catégorie
function validerCategorie() {
  const category = document.getElementById("idea-category").value;
  const categoryError = document.getElementById("categoryError");
  categoryError.innerHTML = "";

  if (category === "") {
    categoryError.innerHTML = "Veuillez sélectionner une catégorie";
    return false;
  }
  return true;
}

// Valider la description
function validerDescription() {
  const description = document.getElementById("idea-description").value;
  const descriptionError = document.getElementById("descriptionError");
  descriptionError.innerHTML = "";

  if (description === "" || description.length < 10 || description.length >500) {
    descriptionError.innerHTML = "Veuillez entrer une description entre 10 et 100 caractères";
    return false;
  }
  return true;
}

// Valider le formulaire
function validateurDuFormulaire() {
  const isTitleValid = validerTitre();
  const isCategoryValid = isTitleValid && validerCategorie();
  const isDescriptionValid = isCategoryValid && validerDescription();

  if (isTitleValid && isCategoryValid && isDescriptionValid) {
    ajouterIdee();
    messageSucces.style.display = "block";
    setTimeout(() => {
      messageSucces.style.display = "none";
    }, 2000);
    return true;
  }

  return false;
}

// Ajouter une idée
function ajouterIdee() {
  const title = document.getElementById("idea-title").value;
  const category = document.getElementById("idea-category").value;
  const description = document.getElementById("idea-description").value;

  const newIdea = {
    title,
    category,
    description,
    approved: false,
  };

  ideas.push(newIdea);
  localStorage.setItem("ideas", JSON.stringify(ideas));

  ideaForm.reset();
  displayIdeas();
}

// Afficher les idées dans la liste
function displayIdeas() {
  ideasList.innerHTML = "";

  ideas.forEach((idea, index) => {

    const ideaItem = document.createElement("div");
    ideaItem.classList.add("idea-item");

    ideaItem.innerHTML = `


  <h3 class="idea-title">${idea.title}</h3>
  <p class="idea-category">Catégorie: ${idea.category}</p>
  <p class="idea-description">${idea.description}</p>
  <p class="idea-status">Status: ${idea.approved ? "Approuvée" : "Non approuvée"}</p>
  <div class ="btn-section">
  <button class="approve-idea" data-index="${index}">Approuver</button>
  <button class="disapprove-idea" data-index="${index}">Désapprouver</button>
  <button class="delete-idea" data-index="${index}">Supprimer</button>
  </div>


`;


    ideasList.appendChild(ideaItem);

    const approveIdeaBtn = ideaItem.querySelector(".approve-idea");
    const disapproveIdeaBtn = ideaItem.querySelector(".disapprove-idea");
    const deleteIdeaBtn = ideaItem.querySelector(".delete-idea");

    approveIdeaBtn.addEventListener("click", () => approveIdea(index));
    disapproveIdeaBtn.addEventListener("click", () => disapproveIdea(index));
    deleteIdeaBtn.addEventListener("click", () => deleteIdea(index));
  });
}

// Approuver une idée
function approveIdea(index) {
  ideas[index].approved = true;
  localStorage.setItem("ideas", JSON.stringify(ideas));
  displayIdeas();
}

// Désapprouver une idée
function disapproveIdea(index) {
  ideas[index].approved = false;
  localStorage.setItem("ideas", JSON.stringify(ideas));
  displayIdeas();
}

// Supprimer une idée
function deleteIdea(index) {
  ideas.splice(index, 1);
  localStorage.setItem("ideas", JSON.stringify(ideas));
  displayIdeas();
}

// Initialiser l'application en affichant les idées existantes
displayIdeas();