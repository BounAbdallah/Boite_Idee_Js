// Initialisation de Supabase
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0YmtlcmRiZHd0b2N2Ynp1cWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwOTAwMDUsImV4cCI6MjAzNjY2NjAwNX0.lu_qfXrrKAXBCT5WqvtjBcxYnNt6dSHE1uwqhbr-0wI";
const url = "https://dtbkerdbdwtocvbzuqhs.supabase.co";
const Database = supabase.createClient(url, key);

// Récupération des idées depuis Supabase
const getIdeas = async () => {
    try {
        const { data, error } = await Database
            .from('idees')
            .select('*');
        
        if (error) {
            throw error;
        }

        displayIdeas(data); // Afficher les idées récupérées
    } catch (error) {
        console.error("Erreur lors de la récupération des idées:", error.message);
    }
};

// Afficher les idées dans le HTML
function displayIdeas(ideas) {
    const ideasList = document.getElementById("ideas-list");
    ideasList.innerHTML = ""; // Vider la liste existante

    ideas.forEach((idea, index) => {
        const ideaItem = createIdeaCard(idea, index);
        ideasList.appendChild(ideaItem);
    });
}

// Créer une carte d'idée
function createIdeaCard(idea, index) {
    const ideaItem = document.createElement("div");
    ideaItem.classList.add("idea-card");

    ideaItem.innerHTML = `
        <h3 class="idea-title">${escapeHtml(idea.Titre)}</h3>
        <p class="idea-category">Catégorie: ${escapeHtml(idea.Categorie)}</p>
        <p class="idea-description">${escapeHtml(idea.Description)}</p>
        <p class="idea-status">Status: ${idea.Status ? "Approuvée" : "Non approuvée"}</p>
        <div class="btn-section">
            <button class="approve-idea" data-index="${index}" ${idea.Status ? "style='display:none'" : ""}>Approuver</button>
            <button class="disapprove-idea" data-index="${index}" ${!idea.Status ? "style='display:none'" : ""}>Désapprouver</button>
            <button class="delete-idea" data-index="${index}">Supprimer</button>
        </div>
    `;

    // Appliquer un style en fonction du statut
    ideaItem.style.border = idea.Status ? "2px solid green" : "2px solid red";

    // Ajouter les événements pour approuver, désapprouver et supprimer une idée
    const approveIdeaBtn = ideaItem.querySelector(".approve-idea");
    const disapproveIdeaBtn = ideaItem.querySelector(".disapprove-idea");
    const deleteIdeaBtn = ideaItem.querySelector(".delete-idea");

    approveIdeaBtn.addEventListener("click", async () => {
        try {
            await updateIdeaStatus(idea.id, true);
        } catch (error) {
            console.error("Erreur lors de l'approbation de l'idée :", error.message);
            alert("Erreur lors de l'approbation de l'idée : " + error.message);
        }
    });

    disapproveIdeaBtn.addEventListener("click", async () => {
        try {
            await updateIdeaStatus(idea.id, false);
        } catch (error) {
            console.error("Erreur lors de la désapprobation de l'idée :", error.message);
            alert("Erreur lors de la désapprobation de l'idée : " + error.message);
        }
    });

    deleteIdeaBtn.addEventListener("click", async () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette idée ?")) {
            try {
                await deleteIdea(idea.id);
            } catch (error) {
                console.error("Erreur lors de la suppression de l'idée :", error.message);
                alert("Erreur lors de la suppression de l'idée : " + error.message);
            }
        }
    });

    return ideaItem;
}

// Mettre à jour le statut d'une idée dans la base de données
async function updateIdeaStatus(id, status) {
    try {
        const { data, error } = await Database
            .from("idees")
            .update({ Status: status })
            .eq("id", id);

        if (error) {
            throw error;
        }

        console.log("Statut de l'idée mis à jour avec succès :", data);
        getIdeas(); // Rafraîchir la liste des idées
    } catch (error) {
        throw error;
    }
}

// Supprimer une idée de la base de données
async function deleteIdea(id) {
    try {
        const { data, error } = await Database
            .from("idees")
            .delete()
            .eq("id", id);

        if (error) {
            throw error;
        }

        console.log("Idée supprimée avec succès :", data);
        getIdeas(); // Rafraîchir la liste des idées
    } catch (error) {
        throw error;
    }
}

// Fonction d'échappement HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Événement au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    getIdeas(); // Récupérer et afficher les idées au chargement

    const textArea = document.getElementById("idea-description");
    const charCount = document.getElementById("char-count");

    // Mise à jour du compteur de caractères en temps réel
    textArea.addEventListener("input", () => {
        const count = textArea.value.length;
        charCount.textContent = `${count}/255 caractères`;
    });
});

// Validation du formulaire avant soumission
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

// Validation du titre de l'idée
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

// Validation de la catégorie de l'idée
function validerCategorie() {
    const category = document.getElementById("idea-category").value;
    const categoryError = document.getElementById("categoryError");
    categoryError.innerHTML = "";

    const validCategories = ["politique", "sport", "santé", "éducation"];

    if (category === "" || !validCategories.includes(category)) {
        categoryError.innerHTML = "Veuillez sélectionner une catégorie valide";
        return false;
    }
    return true;
}

// Validation de la description de l'idée
function validerDescription() {
    const description = document.getElementById("idea-description").value;
    const descriptionError = document.getElementById("descriptionError");
    descriptionError.innerHTML = "";

    if (description === "" || description.length < 10 || description.length > 255) {
        descriptionError.innerHTML = "Veuillez entrer une description entre 10 et 255 caractères";
        return false;
    }
    return true;
}

// Ajouter une idée à la liste et à la base de données

async function ajouterIdee() {
    const title = document.getElementById("idea-title").value;
    const category = document.getElementById("idea-category").value;
    const description = document.getElementById("idea-description").value;

    const newIdea = {
        Titre: title,
        Categorie: category,
        Description: description,
        Status: false,
    };

    try {
        const { data, error } = await Database.from("idees").insert([newIdea]);

        if (error) {
            throw error;
        }

        console.log("Idée ajoutée avec succès :", data);
        getIdeas(); // Rafraîchir la liste des idées après l'insertion
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'idée :", error.message);
        alert("Erreur lors de l'ajout de l'idée : " + error.message);
    }
}


// Sauvegarder une idée (Ancien code, à supprimer ou intégrer dans une fonction appropriée si nécessaire)
const save = document.getElementById("save");

save.addEventListener("click", async (e) => {
    e.preventDefault();

    let titre = document.getElementById("titre").value;
    let description = document.getElementById("description").value;
    let categorie = document.getElementById("categorie").value;

    try {
        const insertObject = {
            Titre: titre,
            Description: description,
            Categorie: categorie
        };
        const { data, error } = await Database.from("idees").insert([insertObject]);
        if (error) {
            throw error;
        }
        console.log("Idée ajoutée avec succès :", data);
        document.getElementById("ideaForm").reset();
        getIdeas();
    } catch (error) {
        console.error("Erreur lors de l'ajout", error);
        alert("Erreur lors de l'ajout de l'idée : " + error.message);
    }
});
