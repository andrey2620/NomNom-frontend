import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";



@Component({
    standalone: true,
    selector: 'codecollective-page',
    templateUrl: './codeCollectiveLanding.html',
    styleUrls: ['./codeCollectiveLanding.scss'],
    imports: [
        CommonModule,
        LoaderComponent,
    ]
})
export class codeCollectiveLandingComponent implements OnInit, AfterViewInit {

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.updatePageMetadata();
        this.initSlider();
        this.initMenu();
        this.initScrollToTop();
        
    }

    private updatePageMetadata() {
        document.title = "TheCodeCollective";

        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
            link.href = "../../../assets/img/LandingCodeCollective/favicon.ico";
        } else {
            link = document.createElement("link");
            link.rel = "icon";
            link.type = "image/png";
            link.href = "../../../assets/img/LandingCodeCollective/favicon.ico";
            document.head.appendChild(link);
        }
    }

    private initSlider() {
        const teamSlider = document.querySelector(".team-slider") as HTMLElement;
        const teamMembers = document.querySelectorAll(".team-member");
        const nextButton = document.querySelector(".next") as HTMLElement;

        if (teamSlider && nextButton && teamMembers.length > 0) {
            let currentIndex = 0;
            const totalSlides = teamMembers.length;

            nextButton.addEventListener("click", () => {
                currentIndex++;

                if (currentIndex >= totalSlides) {
                    teamSlider.style.transition = "none"; // Remove transition to reset without jump
                    teamSlider.style.transform = "translateX(0)";
                    currentIndex = 0;

                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            teamSlider.style.transition = "transform 0.5s ease";
                        }, 50);
                    });
                } else {
                    teamSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
                }
            });
        }
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
    
}
