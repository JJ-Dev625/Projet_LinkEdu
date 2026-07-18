document.addEventListener("DOMContentLoaded", () => {
  // 1. DIAPORAMA
  const slideshowContainer = document.getElementById("app-slideshow");
  const imagesList = ["./images/etu1.jpg", "./images/etu2.jpg", "./images/el1.jpg", "./images/el2.jpg", "./images/ens.jpg", "./images/pri1.jpg"];

  if (slideshowContainer) {
    imagesList.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; transition:opacity 3.5s; z-index:-2;";
      img.style.opacity = index === 0 ? "1" : "0";
      slideshowContainer.appendChild(img);
    });
    setInterval(() => {
      const imgs = slideshowContainer.querySelectorAll("img");
      let active = Array.from(imgs).findIndex(i => i.style.opacity === "1");
      imgs[active].style.opacity = "0";
      imgs[(active + 1) % imagesList.length].style.opacity = "1";
    }, 10000);
  }

  // 2. LOGIQUE TARIFAIRE
  const tarifs = {
    "CONE": 10000, "CP": 15000, "CE1": 15000, "CE2": 15000, "CM1": 15000, "CM2": 15000,
    "6ème": 25000, "5ème": 25000, "4ème": 25000, "3ème": 25000, "2nde": 25000, "1ère": 25000, "Terminale": 25000,
    "Licence 1": 50000, "Licence 2": 55000, "Licence 3": 60000, "Master 1": 80000, "Master 2": 85000
  };

  const currentId = localStorage.getItem('currentCandidatureId');
  const candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];
  const enfant = candidatures.find(c => String(c.id) === String(currentId));
  const classe = enfant ? enfant.classeDemandee : localStorage.getItem("selectedClassForPayment");

  const scolaritePrice = document.getElementById("scolarite-price");
  const totalPrice = document.getElementById("total-price");
  const summaryBadge = document.getElementById("summary-badge");

  if (classe && tarifs[classe]) {
    const montantFormatted = tarifs[classe].toLocaleString('fr-FR') + " FCFA";
    if (scolaritePrice) scolaritePrice.textContent = montantFormatted;
    if (totalPrice) totalPrice.textContent = montantFormatted;
    if (summaryBadge) summaryBadge.textContent = `(${classe})`;
  }

  // 3. PAIEMENT & PIN
  const paymentForm = document.getElementById("payment-form");
  const modalContainer = document.getElementById("payment-modal");
  const modalStatus = document.getElementById("modal-status");
  const pinForm = document.getElementById("pin-form");

  paymentForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    modalContainer.classList.remove("hidden");
    pinForm.style.display = "none";
    modalStatus.innerHTML = `<div class="spinner"></div><h3 style="color: #1F3962;">Initialisation...</h3>`;
    setTimeout(() => {
      modalStatus.innerHTML = `<h3>Code PIN</h3><p>Entrez votre code à 4 chiffres :</p>`;
      pinForm.style.display = "flex";
    }, 2000);
  });

  pinForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    pinForm.style.display = "none";
    modalStatus.innerHTML = `<div class="spinner"></div><h3>Traitement en cours...</h3>`;
    
    setTimeout(() => {
      if (currentId) {
        let list = JSON.parse(localStorage.getItem('candidatures')) || [];
        let index = list.findIndex(c => String(c.id) === String(currentId));
        if (index !== -1) {
          list[index].statut = 'Validé';
          localStorage.setItem('candidatures', JSON.stringify(list));
        }
      }
      modalStatus.innerHTML = `<div class="success-icon">✓</div><h3>Paiement Réussi !</h3>`;
      setTimeout(() => { window.location.href = "./dashboard1.html"; }, 2000);
    }, 2500);
  });

  document.getElementById("cancel-btn")?.addEventListener("click", () => modalContainer.classList.add("hidden"));
});


