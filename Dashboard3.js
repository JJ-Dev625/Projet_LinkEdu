document.addEventListener("DOMContentLoaded", () => {
    // 1. Récupération des données dynamiques (Enfant sélectionné)
    const childId = localStorage.getItem('selectedChildId');
    const candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];
    const enfant = candidatures.find(c => c.id == childId);

    // Mise à jour du Header avec animation
    const headerName = document.querySelector(".welcome-text-centered h2");
    if (headerName && enfant) {
        headerName.textContent = enfant.nom + " 👋";
        headerName.classList.add("fade-in");
    }

    const userStatus = document.getElementById("user-status");
    if (userStatus && enfant) {
        userStatus.textContent = `Élève • Matricule : ${enfant.matricule || 'En attente'}`;
    }

    // --- NOUVEAUTÉ : Chargement des absences ---
    afficherAbsences(enfant);

    // 2. Configuration Démo
    localStorage.setItem("userStudyLevel", enfant?.classeDemandee || "Licence 2"); 
    localStorage.setItem("userMatricule", enfant?.matricule || "LE-2026-0941");

    // Éléments UI
    const banner = document.getElementById("promo-banner");
    const timerDisplay = document.getElementById("countdown-timer");
    const bannerBtn = document.querySelector(".banner-btn");
    const btnSimFree = document.getElementById("btn-sim-free");
    const btnSimLocked = document.getElementById("btn-sim-locked");
    
    const sectionsToLock = [
        { id: "sec-stats", text: "🔒 Contenu Verrouillé" },
        { id: "sec-downloads", text: "🔒 Documents indisponibles" },
        { id: "sec-schedule", text: "🔒 Emploi du temps indisponible" }
    ];

    const targetDate = new Date("September 28, 2026 00:00:00").getTime();
    let countdownInterval = null;

    // 3. Logique de Verrouillage
    function verrouillerDashboard() {
        if (timerDisplay) timerDisplay.textContent = "Expiré 🛑";
        if (banner) {
            banner.style.background = "linear-gradient(135deg, #FEE2E2 0%, #FCA5A5 100%)";
            banner.style.borderColor = "#EF4444";
        }
        sectionsToLock.forEach(sec => {
            const el = document.getElementById(sec.id);
            if (el && !el.classList.contains("locked")) {
                el.classList.add("locked");
                const overlay = document.createElement("div");
                overlay.className = "locked-overlay";
                overlay.innerHTML = `<span>${sec.text}</span>`;
                el.appendChild(overlay);
                overlay.addEventListener("click", triggerAlertAnimation);
            }
        });
    }

    function appliquerAccesTotal(estInscrit = false) {
        if (banner) banner.style.display = estInscrit ? "none" : "flex";
        sectionsToLock.forEach(sec => {
            const el = document.getElementById(sec.id);
            if (el) {
                el.classList.remove("locked");
                const overlay = el.querySelector(".locked-overlay");
                if (overlay) overlay.remove();
            }
        });
    }

    // 4. Fonction pour afficher les absences (dynamique)
    function afficherAbsences(enfant) {
        const list = document.getElementById('absences-list');
        if (!list) return; // Sécurité si l'élément n'existe pas encore
        
        const absences = enfant?.absences || [];

        if (absences.length > 0) {
            list.innerHTML = absences.map(a => `
                <div class="absence-item">
                    <span class="date">${a.date}</span>
                    <p class="motif">${a.motif}</p>
                </div>
            `).join('');
        } else {
            list.innerHTML = "<p style='font-size: 13px; color: #6B7280; padding: 10px;'>Aucune absence enregistrée.</p>";
        }
    }

    function triggerAlertAnimation(e) {
        e.preventDefault();
        if (bannerBtn) {
            bannerBtn.style.transform = "scale(1.15)";
            bannerBtn.style.backgroundColor = "#EF4444";
            setTimeout(() => { bannerBtn.style.transform = ""; bannerBtn.style.backgroundColor = ""; }, 500);
        }
    }

    // 5. Initialisation
    const state = localStorage.getItem("demoForceState");
    const valide = localStorage.getItem("statutReinscription");

    if (valide === "valide") {
        appliquerAccesTotal(true);
    } else if (state === "locked") {
        verrouillerDashboard();
    } else {
        appliquerAccesTotal(false);
    }
});


