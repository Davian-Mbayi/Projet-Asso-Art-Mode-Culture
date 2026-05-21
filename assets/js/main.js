// On attend que la page soit totalement chargée
document.addEventListener('DOMContentLoaded', () => {
    
    // Sélection des éléments HTML
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // Quand on clique sur les 3 barres...
    mobileMenu.addEventListener('click', () => {
        // ... on ajoute ou on retire la classe "active" sur la liste des liens
        navLinks.classList.toggle('active');
    });

});
document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       SYSTÈME DE FILTRAGE DES CATÉGORIES
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. On retire la classe 'active' de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 2. On l'ajoute au bouton cliqué
            button.classList.add('active');

            // 3. On récupère la catégorie demandée
            const filterValue = button.getAttribute('data-filter');

            // 4. On trie les images
            masonryItems.forEach(item => {
                item.style.animationDelay = '0s';
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block'; // On affiche
                } else {
                    item.style.display = 'none'; // On cache
                }
            });
        });
    });

    /* ==========================================
       SYSTÈME DE LIGHTBOX 
       ========================================== */
    const lightboxContainer = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    // Quand on clique sur une image de la galerie...
    triggers.forEach(img => {
        img.addEventListener('click', () => {
            // On récupère la source (src) de l'image cliquée
            const imageSrc = img.getAttribute('src');
            // On la met dans l'image de la Lightbox
            lightboxImage.setAttribute('src', imageSrc);
            // On affiche la Lightbox
            lightboxContainer.classList.add('active');
        });
    });

    // Quand on clique sur la croix pour fermer...
    if(lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightboxContainer.classList.remove('active');
        });
    }

    // Fermer aussi si on clique dans l'espace noir autour de l'image
    if(lightboxContainer) {
        lightboxContainer.addEventListener('click', (e) => {
            if (e.target !== lightboxImage) {
                lightboxContainer.classList.remove('active');
            }
        });
    }
});