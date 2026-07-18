// Déclaration globale pour que les fonctions de visualisation y aient accès
const tempFiles = {}; 

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. DIAPORAMA D'ARRIÈRE-PLAN
  // ==========================================
  const slideshowContainer = document.getElementById("app-slideshow");
  const imagesList = ["./images/etu1.jpg", "./images/etu2.jpg", "./images/el1.jpg", "./images/el2.jpg", "./images/ens.jpg", "./images/pri1.jpg"];

  if (slideshowContainer) {
    let currentImageIndex = 0;
    imagesList.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:0; transition:opacity 3.5s ease-in-out; z-index:-2;";
      if (index === 0) img.style.opacity = "1";
      slideshowContainer.appendChild(img);
    });
    setInterval(() => {
      const imgs = slideshowContainer.querySelectorAll("img");
      if (imgs.length === 0) return;
      imgs[currentImageIndex].style.opacity = "0";
      currentImageIndex = (currentImageIndex + 1) % imagesList.length;
      imgs[currentImageIndex].style.opacity = "1";
    }, 10000);
  }

  // ==========================================
  // 2. GESTION DES FICHIERS & UI
  // ==========================================
  const getBase64 = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
  });

  document.querySelectorAll(".file-input").forEach(input => {
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        tempFiles[e.target.id] = file;
        const parent = e.target.closest(".upload-card");
        const infoZone = parent.querySelector(".file-info");
        infoZone.style.display = "flex";
        infoZone.querySelector(".file-name").textContent = file.name.substring(0, 12) + "...";
        parent.querySelector(".drop-text").textContent = "Chargé !";
      }
    });
  });

  // ==========================================
  // 3. SÉLECTEURS DE CLASSES
  // ==========================================
  const studyLevelSelect = document.getElementById("study-level");
  const prevClassSelect = document.getElementById("prev-class");
  const targetClassSelect = document.getElementById("target-class");
  const classesData = {
    primaire: ["CONE", "CP", "CE1", "CE2", "CM1", "CM2"],
    secondaire: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"],
    superieur: ["Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2", "Doctorat"]
  };

  studyLevelSelect?.addEventListener("change", () => {
    const list = classesData[studyLevelSelect.value] || [];
    [prevClassSelect, targetClassSelect].forEach(select => {
      select.disabled = false;
      select.innerHTML = '<option value="" disabled selected>Choisir...</option>';
      list.forEach(c => select.innerHTML += `<option value="${c}">${c}</option>`);
    });
  });

  // ==========================================
  // 4. SOUMISSION DU FORMULAIRE
  // ==========================================
  document.getElementById("upload-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentId = localStorage.getItem('currentCandidatureId');
    let candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];
    const index = candidatures.findIndex(c => String(c.id) === String(currentId));

    if (index !== -1) {
      candidatures[index].fileId = await getBase64(document.getElementById("file-id").files[0]);
      candidatures[index].fileBulletin = await getBase64(document.getElementById("file-bulletin").files[0]);
      candidatures[index].fileMedical = await getBase64(document.getElementById("file-medical").files[0]);
      candidatures[index].filePhoto = await getBase64(document.getElementById("file-photo").files[0]);
      
      candidatures[index].niveau = studyLevelSelect.value;
      candidatures[index].ecoleOrigine = document.getElementById("school-origin").value;
      candidatures[index].classePrecedente = prevClassSelect.value;
      candidatures[index].classeDemandee = targetClassSelect.value;
      candidatures[index].dossierComplet = true;
      candidatures[index].statut = 'En attente';
      
      localStorage.setItem('candidatures', JSON.stringify(candidatures));
      window.location.href = "./paiement.html";
    }
  });

  // Gestion du retour physique Android pour fermer la modale
  window.addEventListener('popstate', () => {
    if (document.getElementById("modal-visualisation")?.style.display === "flex") {
      fermerVisualisation();
    }
  });
});

// ==========================================
// 5. FONCTIONS GLOBALES DE VISUALISATION
// ==========================================
window.visualiser = (inputId) => {
    const file = tempFiles[inputId];
    
    // Vérification de sécurité : le fichier existe-t-il ?
    if (!file) {
        alert("Erreur : Aucun fichier trouvé pour cet identifiant.");
        return;
    }

    const url = URL.createObjectURL(file);
    const modal = document.getElementById("modal-visualisation");
    const content = document.getElementById("modal-content");
    
    // On vide le contenu précédent
    content.innerHTML = "";

    if (file.type === "application/pdf") {
        const container = document.createElement("div");
        container.style.cssText = "text-align:center; color:white; padding:20px; width: 100%;";
        
        const btn = document.createElement("a"); // Utilisation d'un lien <a>
        btn.textContent = "Ouvrir le PDF";
        btn.href = url;
        btn.target = "_self"; // Ouvre dans la fenêtre actuelle
        btn.style.cssText = "background:#10B881; color:white; padding:15px 25px; border-radius:5px; text-decoration:none; font-size:16px; display:inline-block;";
        
        container.appendChild(btn);
        content.appendChild(container);
    } else {
        // Pour les images, on garde l'affichage dans la modale
        content.innerHTML = `<img src="${url}" style="max-width:100%; max-height:100%; object-fit:contain;"/>`;
    }
    
    // Affichage de la modale
    if (modal) {
        modal.style.display = "flex";
        history.pushState({ modal: 'open' }, '');
    }
};



window.fermerVisualisation = () => {
  const modal = document.getElementById("modal-visualisation");
  if (modal) {
    modal.style.display = "none";
    document.getElementById("modal-content").innerHTML = "";
    if (history.state && history.state.modal === 'open') {
      history.back();
    }
  }
};

window.ouvrirPdf = (url) => {
    // Crée un lien invisible pour forcer l'ouverture
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
};
