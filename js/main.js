
document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       MOBILE MENU
    ========================================= */

    const menuButton =
        document.querySelector(".mobile-menu-button");

    const navigation =
        document.querySelector(".main-nav");


    if (menuButton && navigation) {

        menuButton.addEventListener("click", () => {

            const isOpen =
                navigation.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen
            );

        });


        navigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    navigation.classList.remove("open");

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                });

            });

    }


    /* =========================================
       HERO SLIDER
    ========================================= */

    const slides =
        document.querySelectorAll(".hero-slide");

    const dots =
        document.querySelectorAll(".slider-dots .dot");

    const nextButton =
        document.querySelector(".slider-next");

    const prevButton =
        document.querySelector(".slider-prev");

    const progress =
        document.querySelector(".slider-progress span");


    if (slides.length) {

        let currentSlide = 0;

        let timer = null;

        let startX = 0;

        let endX = 0;

        const interval = 6500;


        function updateProgress() {

            if (!progress) return;

            progress.style.transition = "none";

            progress.style.width = "0";


            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    progress.style.transition =
                        `width ${interval}ms linear`;

                    progress.style.width = "100%";

                });

            });

        }


        function showSlide(index) {

            if (index >= slides.length) {
                index = 0;
            }

            if (index < 0) {
                index = slides.length - 1;
            }


            slides.forEach((slide, i) => {

                slide.classList.toggle(
                    "active",
                    i === index
                );

            });


            dots.forEach((dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === index
                );

            });


            currentSlide = index;

            updateProgress();

        }


        function nextSlide() {

            showSlide(currentSlide + 1);

        }


        function previousSlide() {

            showSlide(currentSlide - 1);

        }


        function startSlider() {

            stopSlider();

            timer = setInterval(
                nextSlide,
                interval
            );

            updateProgress();

        }


        function stopSlider() {

            if (timer) {

                clearInterval(timer);

                timer = null;

            }

        }


        if (nextButton) {

            nextButton.addEventListener(
                "click",
                () => {

                    nextSlide();

                    startSlider();

                }
            );

        }


        if (prevButton) {

            prevButton.addEventListener(
                "click",
                () => {

                    previousSlide();

                    startSlider();

                }
            );

        }


        dots.forEach((dot, index) => {

            dot.addEventListener(
                "click",
                () => {

                    showSlide(index);

                    startSlider();

                }
            );

        });


        const hero =
            document.querySelector(".hero-slider");


        if (hero) {

            hero.addEventListener(
                "mouseenter",
                stopSlider
            );


            hero.addEventListener(
                "mouseleave",
                startSlider
            );


            hero.addEventListener(
                "touchstart",
                event => {

                    startX =
                        event.touches[0].clientX;

                },
                { passive: true }
            );


            hero.addEventListener(
                "touchend",
                event => {

                    endX =
                        event.changedTouches[0].clientX;

                    const difference =
                        startX - endX;


                    if (Math.abs(difference) > 50) {

                        if (difference > 0) {
                            nextSlide();
                        } else {
                            previousSlide();
                        }

                        startSlider();

                    }

                },
                { passive: true }
            );

        }


        showSlide(0);

        startSlider();

    }


    /* =========================================
       PHONE NUMBER PROTECTION
       ========================================= */

    document
        .querySelectorAll("[dir='ltr']")
        .forEach(element => {

            element.style.direction = "ltr";

            element.style.unicodeBidi =
                "embed";

        });


    /* =========================================
       SCROLL HEADER
    ========================================= */

    const header =
        document.querySelector(".site-header");


    if (header) {

        window.addEventListener(
            "scroll",
            () => {

                if (window.scrollY > 20) {

                    header.classList.add(
                        "scrolled"
                    );

                } else {

                    header.classList.remove(
                        "scrolled"
                    );

                }

            },
            { passive: true }
        );

    }


    /* =========================================
       SIMPLE REVEAL ANIMATION
    ========================================= */

    const revealElements =
        document.querySelectorAll(
            ".brand-card, .product-card, .trust-item"
        );


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: .12
                }
            );


        revealElements.forEach(
            element => observer.observe(element)
        );

    }


    /* =========================================
       CURRENT PAGE
    ========================================= */

    const currentPage =
        location.pathname.split("/").pop()
        || "index.html";


    document
        .querySelectorAll(".main-nav a")
        .forEach(link => {

            const href =
                link.getAttribute("href");

            if (
                href === currentPage ||
                (
                    currentPage === "index.html" &&
                    href === "index.html"
                )
            ) {

                link.classList.add("active");

            } else {

                link.classList.remove("active");

            }

        });

});

