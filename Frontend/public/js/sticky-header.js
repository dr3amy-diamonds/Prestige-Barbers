document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.height = '1px';
    sentinel.style.width = '1px';
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
        ([entry]) => {
            header.classList.toggle('is-sticky', !entry.isIntersecting);
        },
        {
            rootMargin: '-1px 0px 0px 0px',
            threshold: 0
        }
    );

    observer.observe(sentinel);
});