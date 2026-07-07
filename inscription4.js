document.addEventListener("DOMContentLoaded", () => {
    // 1. Diaporama
    const slideshowContainer = document.getElementById("app-slideshow");
    const imagesList = ["images/etu1.jpg", "images/etu2.jpg", "images/ens.jpg"]; // Ajoute tes chemins
    imagesList.forEach((src, i) => {
        const img = document.createElement("img");
        img.src = src; img.style.position = "absolute"; img.style.width = "100%"; img.style.height = "100%";
        img.style.objectFit = "cover"; img.style.opacity = i === 0 ? "1" : "0";
        img.style.transition = "opacity 3s ease-in-out"; img.style.zIndex = "-2";
        slideshowContainer.appendChild(img);
    });

    // 2. Soumission
    document.getElementById("register-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const pass = document.getElementById("password").value;
        const conf = document.getElementById("confirmPassword").value;
        
        if (pass !== conf) return alert("Les mots de passe ne correspondent pas.");

        const nouvelleCandidature = {
            id: Date.now(),
            role: document.getElementById("role").value,
            tutorName: document.getElementById("tutorName").value,
            nom: document.getElementById("fullname").value,
            parentEmail: document.getElementById("parentEmail").value,
            password: pass,
            statut: null
        };

        let data = JSON.parse(localStorage.getItem('candidatures')) || [];
        data.push(nouvelleCandidature);
        localStorage.setItem('candidatures', JSON.stringify(data));
        localStorage.setItem('userEmail', nouvelleCandidature.parentEmail);
        localStorage.setItem('currentCandidatureId', nouvelleCandidature.id);

        window.location.href = "Televersement.html";
    });
});

function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}


