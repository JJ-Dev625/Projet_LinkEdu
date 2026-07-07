document.addEventListener("DOMContentLoaded", () => {
    // 1. Récupération des données du parent connecté
    const parentEmail = localStorage.getItem('userEmail');
    const container = document.getElementById('enfants-container');
    const candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];

    // 2. Filtrage des enfants liés à ce parent
    const mesEnfants = candidatures.filter(c => c.parentEmail === parentEmail);

    if (mesEnfants.length === 0) {
        container.innerHTML = "<p style='text-align:center; margin-top:20px;'>Aucun dossier trouvé pour cet identifiant.</p>";
        return;
    }

    // 3. Fonction utilitaire pour le statut
    const getStatusClass = (statut) => {
        if (statut === 'Validé') return 'statut-valide';
        if (statut === 'Refusé') return 'statut-refuse';
        return 'statut-pending';
    };

    // 4. Rendu dynamique des cartes
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
                ${enfant.motifRefus ? `<p style="color:#ef4444; font-size: 0.85rem;"><strong>Note admin :</strong> ${enfant.motifRefus}</p>` : ''}
            </div>

            ${!enfant.statut ? `
                <button class="btn-action" onclick="modifierDossier(${enfant.id})">
                    Compléter / Modifier le dossier
                </button>` : ''}
        </div>
    `).join('');
});

// 5. Navigation vers la modification
window.modifierDossier = (id) => {
    localStorage.setItem('currentCandidatureId', id);
    window.location.href = "Televersement.html";
};
