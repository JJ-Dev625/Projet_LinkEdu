document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('enfants-container');
    const summaryContainer = document.getElementById('parent-header-summary');
    const parentEmail = localStorage.getItem('userEmail');
    const candidatures = JSON.parse(localStorage.getItem('candidatures')) || [];

    const mesEnfants = candidatures.filter(c => c.parentEmail === parentEmail);

    const renderSummary = () => {
        if (mesEnfants.length === 0) return;
        
        const total = mesEnfants.length;
        const valides = mesEnfants.filter(e => e.statut === 'Validé').length;
        
        // On utilise seulement des classes CSS maintenant
        summaryContainer.innerHTML = `
            <div class="glass-card summary-card">
                <h3>Vue d'ensemble</h3>
                <p>Tu suis actuellement <strong>${total}</strong> dossier(s), 
                   dont <strong>${valides}</strong> validé(s).</p>
            </div>
        `;
    };

    const getStatusClass = (statut) => {
        const classes = { 'Validé': 'statut-valide', 'Refusé': 'statut-refuse' };
        return classes[statut] || 'statut-pending';
    };

    const renderList = () => {
        if (mesEnfants.length === 0) {
            container.innerHTML = "<p class='no-data'>Aucun dossier trouvé pour cet identifiant.</p>";
            return;
        }

        container.innerHTML = mesEnfants.map(enfant => `
            <div class="glass-card enfant-card">
                <div class="enfant-header">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(enfant.nom)}&background=10B881&color=fff" 
                         alt="Avatar" class="enfant-avatar">
                    <div>
                        <h3>${enfant.nom}</h3>
                        <span class="classe-label">Classe : ${enfant.classeDemandee || 'N/A'}</span>
                    </div>
                </div>
                <div class="enfant-body">
                    <p><strong>Statut :</strong> 
                       <span class="status-tag ${getStatusClass(enfant.statut)}">${enfant.statut || 'En attente'}</span>
                    </p>
                    ${enfant.matricule ? `<p><strong>Matricule :</strong> <code>${enfant.matricule}</code></p>` : ''}
                </div>
                <div class="enfant-actions">
                    <button class="btn-action" onclick="voirSuivi(${enfant.id})">Voir le suivi</button>
                    ${!enfant.statut ? `<button class="btn-secondary" onclick="modifierDossier(${enfant.id})">Modifier</button>` : ''}
                </div>
            </div>
        `).join('');
    };

    renderSummary();
    renderList();
});

window.voirSuivi = (id) => { localStorage.setItem('selectedChildId', id); window.location.href = "dashboard1.html"; };
window.modifierDossier = (id) => { localStorage.setItem('currentCandidatureId', id); window.location.href = "Televersement.html"; };
