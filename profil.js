document.addEventListener("DOMContentLoaded", () => {
    // 1. Récupération de l'ID de l'enfant sélectionné
    const childId = localStorage.getItem('selectedChildId');
    const candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];
    const enfant = candidatures.find(c => c.id == childId);

    // 2. Si un enfant est trouvé, on met à jour les éléments de la page
    if (enfant) {
        // Mise à jour du nom
        const headerName = document.querySelector(".profil-header h2");
        if (headerName) headerName.textContent = enfant.nom;

        // Mise à jour du matricule
        const studentId = document.querySelector(".student-id");
        if (studentId) studentId.textContent = "Matricule : " + (enfant.matricule || "Non assigné");

        // Mise à jour de la classe
        const classTag = document.querySelector(".class-tag");
        if (classTag) classTag.textContent = enfant.classeDemandee || "Classe non définie";
    }
});


