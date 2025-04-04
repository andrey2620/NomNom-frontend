import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";



@Component({
    standalone: true,
    selector: 'nomnom-page',
    templateUrl: './nomNomLanding.html',
    styleUrls: ['./nomNomLanding.scss'],
    imports: [
        CommonModule,
        LoaderComponent,
    ]
})
export class nomNomLandingComponent implements OnInit, AfterViewInit {

    constructor(private renderer: Renderer2) { }

    ngOnInit() {
        // Suprimir las advertencias NG0913 específicas
        const suppressNgWarnings = () => {
            const originalConsoleWarn = console.warn;
            console.warn = (...args: any[]) => {
                if (args && args[0] && args[0].includes('NG0913')) {
                    return;
                }
                originalConsoleWarn(...args);
            };
        };
        suppressNgWarnings();

    }

    ngAfterViewInit() {
        // Código JS que interactúa con el DOM de Angular después de que Angular haya terminado de renderizar
        this.initMenu();
        this.initScrollToTop();
        this.initCarousel();
    }

    private initMenu() {
        const menuIcon = document.querySelector(".menu-icon");
        const navMenu = document.querySelector("nav ul");

        if (menuIcon && navMenu) {
            menuIcon.addEventListener("click", function () {
                navMenu.classList.toggle("active");
            });
        }
    }

    private initScrollToTop() {
        const scrollToTopBtn = document.getElementById("scrollToTop");

        if (scrollToTopBtn) {
            // Mostrar el botón cuando el usuario baja 200px
            window.addEventListener("scroll", function () {
                if (window.scrollY > 200) {
                    scrollToTopBtn.style.display = "flex";
                } else {
                    scrollToTopBtn.style.display = "none";
                }
            });

            // Hacer scroll hacia arriba al hacer clic
            scrollToTopBtn.addEventListener("click", function () {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
        }
    }

    private initCarousel() {
        const carousel = document.querySelector(".carousel") as HTMLElement;
        const prevBtn = document.querySelector(".prev-btn") as HTMLElement;
        const nextBtn = document.querySelector(".next-btn") as HTMLElement;
        let index = 0;

        const items = document.querySelectorAll(".carousel-item");
        const totalItems = items.length;

        if (carousel && prevBtn && nextBtn) {
            function updateCarousel() {
                if (carousel instanceof HTMLElement) {
                    carousel.style.transition = "transform 0.5s ease-in-out";
                    const offset = -index * 100; // Moves by 100% per item
                    carousel.style.transform = `translateX(${offset}%)`;
                }
            }

            nextBtn.addEventListener("click", function () {
                if (index >= totalItems - 1) {
                    // Move first item to the end
                    if (carousel && carousel.firstElementChild) {
                        carousel.appendChild(carousel.firstElementChild);
                    }
                    index = totalItems - 2; // Adjust index
                    if (carousel) {
                        carousel.style.transition = "none";
                        carousel.style.transform = `translateX(${-index * 100}%)`;
                    }
                    setTimeout(() => {
                        if (carousel) {
                            carousel.style.transition = "transform 0.5s ease-in-out";
                        }
                        index++;
                        updateCarousel();
                    }, 50);
                } else {
                    index++;
                    updateCarousel();
                }
            });

            prevBtn.addEventListener("click", function () {
                if (index <= 0) {
                    // Mover el ultimo elemento al inicio
                    if (carousel && carousel.lastElementChild) {
                        carousel.prepend(carousel.lastElementChild);
                    }
                    index = 1; // Ajustar el índice
                    if (carousel) {
                        carousel.style.transition = "none";
                        carousel.style.transform = `translateX(${-index * 100}%)`;
                    }
                    setTimeout(() => {
                        if (carousel) {
                            carousel.style.transition = "transform 0.5s ease-in-out";
                        }
                        index--;
                        updateCarousel();
                    }, 50);
                } else {
                    index--;
                    updateCarousel();
                }
            });

            // Auto-slide every 3 seconds without sudden jumps
            let autoSlide = setInterval(() => {
                nextBtn.click();
            }, 3000); // Set to 3 seconds instead of 5

            // Stop auto-slide when user interacts, restart after inactivity
            function resetAutoSlide() {
                clearInterval(autoSlide);
                autoSlide = setInterval(() => {
                    nextBtn.click();
                }, 3000); // Reset to 3 seconds interval
            }

            prevBtn.addEventListener("click", resetAutoSlide);
            nextBtn.addEventListener("click", resetAutoSlide);
        }
    }
}