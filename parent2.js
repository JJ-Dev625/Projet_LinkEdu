document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('enfants-container');
    const parentEmail = localStorage.getItem('userEmail');
    const candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];

    // Filtrage des enfants liés au parent
    const mesEnfants = candidatures.filter(c => c.parentEmail === parentEmail);

    if (mesEnfants.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>Aucun dossier trouvé pour cet identifiant.</p>";
        return;
    }

    const getStatusClass = (statut) => {
        if (statut === 'Validé') return 'statut-valide';
        if (statut === 'Refusé') return 'statut-refuse';
        return 'statut-pending';
    };

    container.innerHTML = mesEnfants.map(enfant => `
        <div class="glass-card enfant-card">
            <div class="enfant-header">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(enfant.nom)}&background=10B881&color=fff" 
                     alt="Avatar de ${enfant.nom}" class="enfant-avatar">
                <div>
                    <h3>${enfant.nom}</h3>
                    <span class="classe-label">Classe : ${enfant.classeDemandee || 'Non assignée'}</span>
                </div>
            </div>
            
            <div class="enfant-body">
                <p><strong>Statut :</strong> 
                   <span class="status-tag ${getStatusClass(enfant.statut)}">
                       ${enfant.statut || 'En cours de traitement'}
                   </span>
                </p>
                ${enfant.matricule ? `<p><strong>Matricule :</strong> <code>${enfant.matricule}</code></p>` : ''}
            </div>

            <div class="enfant-actions">
                <button class="btn-action" onclick="voirSuivi(${enfant.id})">Voir le suivi</button>
                ${!enfant.statut ? `<button class="btn-secondary" onclick="modifierDossier(${enfant.id})">Modifier</button>` : ''}
            </div>
        </div>
    `).join('');
});

// Fonction pour sélectionner l'enfant et naviguer
window.voirSuivi = (id) => {
    localStorage.setItem('selectedChildId', id);
    window.location.href = "dashboard1.html";
};

window.modifierDossier = (id) => {
    localStorage.setItem('currentCandidatureId', id);
    window.location.href = "Televersement.html";
};


