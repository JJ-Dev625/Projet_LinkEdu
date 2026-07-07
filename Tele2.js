document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. DIAPORAMA D'ARRIÈRE-PLAN
  // ==========================================
  const slideshowContainer = document.getElementById("app-slideshow");
  const imagesList = [
    "./images/etu1.jpg", "./images/etu2.jpg", "./images/el1.jpg",
    "./images/el2.jpg", "./images/ens.jpg", "./images/pri1.jpg"
  ];

  if (slideshowContainer) {
    let currentImageIndex = 0;
    imagesList.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = "0";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.objectPosition = "center";
      img.style.opacity = index === 0 ? "1" : "0";
      img.style.transition = "opacity 3.5s ease-in-out";
      img.style.zIndex = "-2";
      slideshowContainer.appendChild(img);
    });

    setInterval(() => {
      const imgs = slideshowContainer.querySelectorAll("img");
      if (imgs.length > 0) {
        imgs[currentImageIndex].style.opacity = "0";
        currentImageIndex = (currentImageIndex + 1) % imagesList.length;
        imgs[currentImageIndex].style.opacity = "1";
      }
    }, 10000);
  }

  // ==========================================
  // 2. GESTION DES FICHIERS (UX)
  // ==========================================
  const fileInputs = document.querySelectorAll(".file-input");
  fileInputs.forEach(input => {
    input.addEventListener("change", (e) => {
      const parentZone = e.target.closest(".drop-zone");
      if (!parentZone) return;
      
      const textElement = parentZone.querySelector(".drop-text");
      const iconElement = parentZone.querySelector(".drop-icon");

      if (e.target.files.length > 0) {
        const fileName = e.target.files[0].name;
        textElement.textContent = fileName.length > 12 ? fileName.substring(0, 9) + "..." : fileName;
        if (iconElement) {
            iconElement.className = "fa-solid fa-check-circle drop-icon";
        }
        parentZone.style.borderColor = "#10B881";
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

  if (studyLevelSelect) {
    studyLevelSelect.addEventListener("change", () => {
      const classesList = classesData[studyLevelSelect.value] || [];
      
      [prevClassSelect, targetClassSelect].forEach(select => {
        if (select) {
          select.disabled = false;
          select.innerHTML = '<option value="" disabled selected>Choisir...</option>';
          classesList.forEach(className => {
            select.innerHTML += `<option value="${className}">${className}</option>`;
          });
        }
      });
    });
  }

  // ==========================================
  // 4. SOUMISSION DU FORMULAIRE
  // ==========================================
  const uploadForm = document.getElementById("upload-form");
  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const currentId = localStorage.getItem('currentCandidatureId');
      if (currentId) {
        let candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];
        const index = candidatures.findIndex(c => String(c.id) === String(currentId));

        if (index !== -1) {
          candidatures[index].niveau = studyLevelSelect.value;
          candidatures[index].ecoleOrigine = document.getElementById("school-origin").value;
          candidatures[index].classePrecedente = prevClassSelect.value;
          candidatures[index].classeDemandee = targetClassSelect.value;
          candidatures[index].dossierComplet = true; 
          
          localStorage.setItem('candidatures', JSON.stringify(candidatures));
          window.location.href = "./paiement.html";
        } else {
          alert("Erreur: Candidature introuvable.");
        }
      }
    });
  }
});


