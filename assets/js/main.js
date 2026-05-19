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