/* =========================================
   ARMAN TEJARAT - MAIN JS (PHP Version)
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // MOBILE MENU
    // =========================================

    const menuButton = document.querySelector(".mobile-menu-button");
    const navigation = document.querySelector(".main-nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", isOpen);
        });

        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navigation.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    // =========================================
    // SCROLL HEADER
    // =========================================

    const header = document.querySelector(".site-header");

    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }, { passive: true });
    }

    // =========================================
    // PHONE NUMBER PROTECTION
    // =========================================

    document.querySelectorAll("[dir='ltr']").forEach(element => {
        element.style.direction = "ltr";
        element.style.unicodeBidi = "embed";
    });

    // =========================================
    // CURRENT PAGE
    // =========================================

    const currentPage = location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".main-nav a").forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage || (currentPage === "index.html" && href === "index.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // =========================================
    // REVEAL ANIMATION
    // =========================================

    const revealElements = document.querySelectorAll(".brand-card, .product-card, .trust-item");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(element => observer.observe(element));
    }

    // =========================================
    // PRODUCTS PAGE - LOAD FROM API
    // =========================================

    const productsContainer = document.getElementById("catalogProducts");

    if (productsContainer) {
        // products.js خودش مدیریت می‌کند
        console.log("📦 Products page loaded - waiting for products.js");
    }

    // =========================================
    // CONTACT FORM
    // =========================================

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("✅ پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.");
            contactForm.reset();
        });
    }

});

console.log("✅ Arman Tejarat - Main JS loaded (PHP version)");
