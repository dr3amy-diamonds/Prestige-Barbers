// Menú hamburguesa - funciona en todas las páginas
document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('hamburgerBtn');
    var menu = document.getElementById('navMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('nav-open');
        btn.classList.toggle('is-active', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar menú al hacer click en un link
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menu.classList.remove('nav-open');
            btn.classList.remove('is-active');
            btn.setAttribute('aria-expanded', false);
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove('nav-open');
            btn.classList.remove('is-active');
            btn.setAttribute('aria-expanded', false);
        }
    });
});
