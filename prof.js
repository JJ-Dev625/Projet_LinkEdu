
  // Fonction pour charger les données du profil
   function loadProfProfile() {
    const profData = JSON.parse(localStorage.getItem("profProfile")) || {
        name: "Mme. Sara AVOME",
        role: "Prof. de Philosophie"
    };
    
    document.getElementById("prof-name").textContent = profData.name;
    document.getElementById("prof-role").textContent = profData.role;
}

    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('active');
    }

    function showSection(sectionId, element) {
      // Masquer toutes les sections
      document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
      });
      // Afficher la section demandée
      document.getElementById(sectionId).style.display = 'block';
      
      // Mettre à jour l'état actif dans le menu
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      element.classList.add('active');

      // Fermer le menu sur mobile après sélection
      if(window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
      }
    }
    
    // Gestion de la sauvegarde du cahier de texte
const cahierForm = document.getElementById("cahierForm");

cahierForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const entry = {
        date: document.getElementById("cahierDate").value,
        classe: document.getElementById("cahierClasse").value,
        contenu: document.getElementById("cahierContenu").value,
        devoir: document.getElementById("cahierDevoir").value,
        timestamp: new Date().getTime()
    };

    // Récupérer l'existant ou créer un nouveau tableau
    let entries = JSON.parse(localStorage.getItem("cahierEntries")) || [];
    entries.push(entry);
    
    // Sauvegarder
    localStorage.setItem("cahierEntries", JSON.stringify(entries));
    
    alert("Séance enregistrée avec succès !");
    cahierForm.reset();
});
