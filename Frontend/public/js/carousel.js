document.addEventListener('DOMContentLoaded', () => {
    class Carousel {
        constructor(containerId) {
            this.carouselContainer = document.getElementById(containerId);
            if (!this.carouselContainer) {
                console.error(`Carousel container with id ${containerId} not found.`);
                return;
            }

            this.carouselTrack = document.createElement('div');
            this.carouselTrack.className = 'carousel-track';
            this.carouselContainer.appendChild(this.carouselTrack);

            this.cuts = [];
            this.slideCount = 0;
            this.currentIndex = 1;
            this.intervalId = null;
            this.isDragging = false;
            this.startX = 0;
            this.currentTranslate = 0;
            this.prevTranslate = 0;
            this.animationID = 0;
            this.isInitialLoad = true;
            this.containerWidth = this.carouselContainer.getBoundingClientRect().width;
            this.isTransitioning = false;

            this.fetchCuts();
            this.setupEventListeners();
        }

        fetchCuts() {
            fetch('/api/cortes')
                .then(response => response.json())
                .then(data => {
                    this.cuts = data;
                    this.slideCount = this.cuts.length;
                    if (this.slideCount === 0) return;

                    this.createSlides();
                    this.createDots();
                    this.resizeCarousel();
                    this.updateDots();
                    this.resetInterval();

                    if (this.isInitialLoad) {
                        this.carouselContainer.style.opacity = 0;
                        setTimeout(() => {
                            this.carouselContainer.style.opacity = 1;
                        }, 100);
                        this.isInitialLoad = false;
                    }
                })
                .catch(error => console.error('Error fetching cuts:', error));
        }

        createSlides() {
            const slideElements = this.cuts.map((cut, index) => {
                const slide = document.createElement('div');
                slide.className = 'slide';
                slide.innerHTML = `
                    <img src="${cut.image_url}" alt="${cut.name}">
                    <div class="main-cut-imgs-text">
                        <h2>Destacados de la semana</h2>
                        <h3>${cut.name}</h3>
                        <p>${cut.description}</p>
                        <a href="">Reserva Ahora</a>
                    </div>
                `;
                const text = slide.querySelector('.main-cut-imgs-text');
                if (index !== 0) {
                    text.style.opacity = 0;
                }
                const link = slide.querySelector('a');
                link.addEventListener('click', (e) => e.preventDefault());
                return slide;
            });

            const firstClone = slideElements[0].cloneNode(true);
            const lastClone = slideElements[this.slideCount - 1].cloneNode(true);

            firstClone.querySelector('.main-cut-imgs-text').style.opacity = 0;
            lastClone.querySelector('.main-cut-imgs-text').style.opacity = 0;

            this.carouselTrack.appendChild(lastClone);
            slideElements.forEach(slide => this.carouselTrack.appendChild(slide));
            this.carouselTrack.appendChild(firstClone);

            const allSlides = Array.from(this.carouselTrack.children);
            const firstRealSlideText = allSlides[1]?.querySelector('.main-cut-imgs-text');
            if (firstRealSlideText) firstRealSlideText.style.opacity = 1;
        }

        createDots() {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'carousel-dots';
            this.carouselContainer.appendChild(dotsContainer);

            this.cuts.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    this.goToSlide(index + 1);
                });
                dotsContainer.appendChild(dot);
            });
        }

        updateDots() {
            const dots = this.carouselContainer.querySelectorAll('.dot');
            let logicalIndex = this.currentIndex - 1;
            if (this.currentIndex === 0) {
                logicalIndex = this.slideCount - 1;
            } else if (this.currentIndex === this.slideCount + 1) {
                logicalIndex = 0;
            }
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === logicalIndex);
            });
        }

        goToSlide(index) {
            if (this.isTransitioning) return;

            if (!this.isDragging && index === this.currentIndex) {
                this.carouselTrack.style.transition = 'transform 0.5s ease-out';
                this.setPositionByIndex();
                return;
            }

            this.isTransitioning = true;
            const slides = this.carouselTrack.querySelectorAll('.slide');
            const currentText = slides[this.currentIndex]?.querySelector('.main-cut-imgs-text');
            if (currentText) currentText.style.opacity = 0;

            this.carouselTrack.style.transition = 'transform 0.5s ease-out';
            this.currentIndex = index;
            this.setPositionByIndex();
            this.updateDots();
            this.resetInterval();

            setTimeout(() => {
                const atLastClone = this.currentIndex === this.slideCount + 1;
                const atFirstClone = this.currentIndex === 0;

                if (atLastClone || atFirstClone) {
                    this.carouselTrack.style.transition = 'none';
                    this.currentIndex = atLastClone ? 1 : this.slideCount;
                    this.setPositionByIndex();
                }

                const newSlides = this.carouselTrack.querySelectorAll('.slide');
                const newText = newSlides[this.currentIndex]?.querySelector('.main-cut-imgs-text');
                if (newText) newText.style.opacity = 1;

                this.isTransitioning = false;
            }, 500);
        }

        nextSlide() {
            this.goToSlide(this.currentIndex + 1);
        }

        resetInterval() {
            clearInterval(this.intervalId);
            this.intervalId = setInterval(() => this.nextSlide(), 5000);
        }

        resizeCarousel() {
            this.containerWidth = this.carouselContainer.getBoundingClientRect().width;
            this.carouselTrack.style.transition = 'none';
            const allSlides = this.carouselTrack.querySelectorAll('.slide');
            this.carouselTrack.style.width = `${allSlides.length * this.containerWidth}px`;
            allSlides.forEach(slide => {
                slide.style.width = `${this.containerWidth}px`;
            });
            this.setPositionByIndex();
        }

        setupEventListeners() {
            window.addEventListener('resize', () => this.resizeCarousel());

            this.carouselContainer.addEventListener('mousedown', (e) => this.dragStart(e));
            this.carouselContainer.addEventListener('touchstart', (e) => this.dragStart(e));
            this.carouselContainer.addEventListener('mousemove', (e) => this.dragMove(e));
            this.carouselContainer.addEventListener('touchmove', (e) => this.dragMove(e));
            this.carouselContainer.addEventListener('mouseup', () => this.dragEnd());
            this.carouselContainer.addEventListener('mouseleave', () => this.dragEnd());
            this.carouselContainer.addEventListener('touchend', () => this.dragEnd());
        }

        dragStart(event) {
            if (this.isTransitioning) return;
            this.isDragging = true;
            this.startX = this.getPositionX(event);
            this.animationID = requestAnimationFrame(() => this.animation());
            this.carouselTrack.style.transition = 'none';
            this.carouselContainer.classList.add('grabbing');
        }

        dragMove(event) {
            if (this.isDragging) {
                const currentPosition = this.getPositionX(event);
                this.currentTranslate = this.prevTranslate + currentPosition - this.startX;
            }
        }

        dragEnd() {
            if (!this.isDragging) return;
            this.isDragging = false;
            cancelAnimationFrame(this.animationID);
            this.carouselContainer.classList.remove('grabbing');

            const movedBy = this.currentTranslate - this.prevTranslate;
            if (movedBy < -50) {
                this.goToSlide(this.currentIndex + 1);
            } else if (movedBy > 50) {
                this.goToSlide(this.currentIndex - 1);
            } else {
                this.goToSlide(this.currentIndex);
            }
        }

        getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        animation() {
            if (this.isDragging) {
                this.setSliderPosition();
                requestAnimationFrame(() => this.animation());
            }
        }

        setSliderPosition() {
            this.carouselTrack.style.transform = `translateX(${this.currentTranslate}px)`;
        }

        setPositionByIndex() {
            this.currentTranslate = this.currentIndex * -this.containerWidth;
            this.prevTranslate = this.currentTranslate;
            this.carouselTrack.style.transform = `translateX(${this.currentTranslate}px)`;
        }
    }

    new Carousel('carousel-container');
});