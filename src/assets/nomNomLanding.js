console.log("NomNomLandingPage JS loaded");

document.addEventListener("DOMContentLoaded", function() {
    const menuIcon = document.querySelector(".menu-icon");
    const navMenu = document.querySelector("nav ul");

    menuIcon.addEventListener("click", function() {
        navMenu.classList.toggle("active");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const scrollToTopBtn = document.getElementById("scrollToTop");

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
});

//carrousel
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    let index = 0; // Start at the first real item

    const items = document.querySelectorAll(".carousel-item");
    const totalItems = items.length;

    function updateCarousel() {
        carousel.style.transition = "transform 0.5s ease-in-out";
        const offset = -index * 100; // Moves by 100% per item
        carousel.style.transform = `translateX(${offset}%)`;
    }

    nextBtn.addEventListener("click", function () {
        if (index >= totalItems - 1) {
            // Move first item to the end
            carousel.appendChild(carousel.firstElementChild);
            index = totalItems - 2; // Adjust index
            carousel.style.transition = "none";
            carousel.style.transform = `translateX(${-index * 100}%)`;
            setTimeout(() => {
                carousel.style.transition = "transform 0.5s ease-in-out";
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
            // Move last item to the front
            carousel.prepend(carousel.lastElementChild);
            index = 1; // Adjust index
            carousel.style.transition = "none";
            carousel.style.transform = `translateX(${-index * 100}%)`;
            setTimeout(() => {
                carousel.style.transition = "transform 0.5s ease-in-out";
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

});


function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("show");
}
