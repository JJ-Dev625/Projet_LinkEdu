document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.querySelector('.content');
    const sidebar = document.getElementById('sidebar');
    const burgerMenu = document.getElementById('burger-menu');

    // --- MOTEUR DE VUES ---
    const render = (view) => {
        const cands = JSON.parse(localStorage.getItem('candidatures')) || [];
        const ens = JSON.parse(localStorage.getItem('enseignants')) || [];
        mainContent.innerHTML = "";

        if (view === 'dashboard') {
            mainContent.innerHTML = `
                <div class="glass-card">
                    <h3>Tableau de bord</h3>
                    <div class="stats-grid">
                        <div class="stat-box"><h4>${cands.length}</h4><p>Total</p></div>
                        <div class="stat-box"><h4>${cands.filter(c => c.statut === 'Validé').length}</h4><p>Inscrits</p></div>
                        <div class="stat-box"><h4>${cands.filter(c => !c.statut).length}</h4><p>En attente</p></div>
                        <div class="stat-box"><h4>${cands.filter(c => c.statut === 'Refusé').length}</h4><p>Refusés</p></div>
                    </div>
                    <div class="stat-box" style="margin-top:20px;"><h4>${ens.length}</h4><p>Enseignants actifs</p></div>
                </div>`;
        } else if (['traitement', 'valides', 'refuses'].includes(view)) {
            const list = view === 'traitement' ? cands.filter(c => !c.statut) : 
                         view === 'valides' ? cands.filter(c => c.statut === 'Validé') : 
                         cands.filter(c => c.statut === 'Refusé');
            
            mainContent.innerHTML = `
                <div class="glass-card">
                    <h3>${view.toUpperCase()}</h3>
                    <table>
                        <thead><tr><th>Élève</th><th>Classe</th><th>Documents</th><th>Actions</th></tr></thead>
                        <tbody>${list.length > 0 ? list.map(c => `<tr>
                            <td>${c.nom} ${c.prénom}</td><td>${c.classeDemandee}</td>
                            <td><button class="btn-action" onclick="voirDocuments(${c.id})"><i class="fa-solid fa-eye"></i></button></td>
                            <td>${view === 'traitement' ? 
                                `<button class="btn-action btn-valider" onclick="majStatut(${c.id}, 'Validé')">Accepter</button> 
                                 <button class="btn-action btn-refuser" onclick="refuserDossier(${c.id})">Refuser</button>` : 
                                 c.statut || 'N/A'}</td>
                        </tr>`).join('') : '<tr><td colspan="4" style="text-align:center">Aucun dossier</td></tr>'}</tbody>
                    </table>
                </div>`;
        } else if (view === 'enseignants') {
            mainContent.innerHTML = `
                <div class="glass-card">
                    <h3>Gestion Enseignants</h3>
                    <button class="btn-action" style="margin-bottom:15px; background:var(--primary-vert)" onclick="gererEnseignant()">+ Ajouter</button>
                    <table>
                        <thead><tr><th>Nom</th><th>Matière</th><th>Planning</th><th>Action</th></tr></thead>
                        <tbody>${ens.map(e => `<tr>
                            <td>${e.nom}</td><td>${e.matiere}</td><td>${e.planning}</td>
                            <td><button class="btn-action" onclick="supprimerEnseignant(${e.id})" style="background:#ef4444">X</button></td>
                        </tr>`).join('')}</tbody>
                    </table>
                </div>`;
        }
        
        // Injection du footer
        mainContent.insertAdjacentHTML('beforeend', `
            <footer class="admin-footer">
                <p>LinkEdu Admin &copy; 2026 | v1.2.0</p>
                <p>Développé par Jean Junior DIRAMBA MAMBOUNDOU - Bikélé, Gabon</p>
            </footer>`);
    };

    // --- LOGIQUE ACTIONS ---
    window.majStatut = (id, status) => {
        let list = JSON.parse(localStorage.getItem('candidatures'));
        const idx = list.findIndex(c => c.id == id);
        if (idx !== -1) {
            list[idx].statut = status;
            localStorage.setItem('candidatures', JSON.stringify(list));
            alert("Statut mis à jour et notification envoyée.");
            render('traitement');
        }
    };

    window.refuserDossier = (id) => {
        const motif = prompt("Raison du refus :");
        if (motif) {
            let list = JSON.parse(localStorage.getItem('candidatures'));
            const idx = list.findIndex(c => c.id == id);
            list[idx].statut = 'Refusé';
            list[idx].motifRefus = motif;
            localStorage.setItem('candidatures', JSON.stringify(list));
            render('refuses');
        }
    };

    window.gererEnseignant = () => {
        const nom = prompt("Nom :");
        const matiere = prompt("Matière :");
        const planning = prompt("Planning (Jour/Heure) :");
        if (nom && matiere && planning) {
            let ens = JSON.parse(localStorage.getItem('enseignants')) || [];
            ens.push({ id: Date.now(), nom, matiere, planning });
            localStorage.setItem('enseignants', JSON.stringify(ens));
            render('enseignants');
        }
    };

    window.supprimerEnseignant = (id) => {
        let ens = JSON.parse(localStorage.getItem('enseignants')).filter(e => e.id !== id);
        localStorage.setItem('enseignants', JSON.stringify(ens));
        render('enseignants');
    };

    window.voirDocuments = (id) => {
        const c = JSON.parse(localStorage.getItem('candidatures')).find(x => x.id == id);
        document.getElementById("modal-content").innerHTML = `
            <h3>Documents de ${c.nom}</h3>
            <p>Le système affichera ici les fichiers téléversés.</p>
            <button class="btn-action" onclick="document.getElementById('modal-visualisation').style.display='none'">Fermer</button>`;
        document.getElementById("modal-visualisation").style.display = "flex";
    };

    // --- NAVIGATION & RESPONSIVE ---
    document.addEventListener('click', (e) => {
        if (e.target.closest('#burger-menu')) {
            sidebar.classList.toggle('active');
        }
        const target = e.target.closest('li[data-target]');
        if (target) {
            render(target.dataset.target);
            if (window.innerWidth <= 768) sidebar.classList.remove('active');
        }
        if (e.target.classList.contains('btn-logout')) window.location.href = 'index.html';
    });

    render('dashboard');
});
