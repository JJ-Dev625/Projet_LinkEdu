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

    // 2. Configuration Démo (Forçage pour le jury)
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

    function triggerAlertAnimation(e) {
        e.preventDefault();
        if (bannerBtn) {
            bannerBtn.style.transform = "scale(1.15)";
            bannerBtn.style.backgroundColor = "#EF4444";
            setTimeout(() => { bannerBtn.style.transform = ""; bannerBtn.style.backgroundColor = ""; }, 500);
        }
    }

    // 4. Compte à rebours
    function initRealCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0 || localStorage.getItem("demoForceState") === "locked") {
                clearInterval(countdownInterval);
                verrouillerDashboard();
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                if (timerDisplay) timerDisplay.textContent = `${days}j ${hours}h ${minutes}m ${seconds}s`;
            }
        }, 1000);
    }

    // 5. Événements des boutons de simulation (Jury)
    btnSimFree.addEventListener("click", () => {
        localStorage.setItem("demoForceState", "free");
        localStorage.removeItem("statutReinscription");
        appliquerAccesTotal(false);
        initRealCountdown();
    });

    btnSimLocked.addEventListener("click", () => {
        localStorage.setItem("demoForceState", "locked");
        clearInterval(countdownInterval);
        verrouillerDashboard();
    });

    // Initialisation au chargement
    const state = localStorage.getItem("demoForceState");
    const valide = localStorage.getItem("statutReinscription");

    if (valide === "valide") {
        appliquerAccesTotal(true);
    } else if (state === "locked") {
        verrouillerDashboard();
    } else {
        appliquerAccesTotal(false);
        initRealCountdown();
    }
});
