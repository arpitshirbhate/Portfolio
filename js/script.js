(function () {
    // Vercel Analytics Integration
    function addVercelAnalytics() {
        const script = document.createElement('script');
        // This is the recommended Vercel Analytics script path
        script.src = '/_vercel/insights/script.js';
        script.defer = true;
        document.head.appendChild(script);
    }

    // Add Vercel Analytics to the page once the DOM is ready
    document.addEventListener('DOMContentLoaded', addVercelAnalytics);

    // --- 1. DOM Elements (Optimized) ---
    const DOM = {
        themeToggle: document.getElementById('theme-toggle'),
        navToggle: document.querySelector('.nav-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        heroTitle: document.querySelector('.hero-title'),
        contactForm: document.getElementById('contact-form'),
        sections: document.querySelectorAll('section'),
        profileCard: document.querySelector('.profile-card'),
        skillItems: document.querySelectorAll('.skill-item'),
        timelineItems: document.querySelectorAll('.timeline-item'),
        statCounters: document.querySelectorAll('.stat h3'),
        navbar: document.querySelector('.navbar'),
        animatedElements: document.querySelectorAll('.skill-category, .timeline-item, .stat, .contact-method, .profiles .profile-card')
    };

    // --- 2. Theme Toggling (Optimized) ---
    const ThemeManager = {
        init: function () {
            const savedTheme = localStorage.getItem('theme') || 'light';
            this.setTheme(savedTheme);
            DOM.themeToggle?.addEventListener('click', () => this.toggleTheme());
        },
        setTheme: function (theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            this.updateIcon(theme);
        },
        toggleTheme: function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        },
        updateIcon: function (theme) {
            const icon = DOM.themeToggle?.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    };

    // --- 3. Navigation (Optimized) ---
    const NavigationManager = {
        init: function () {
            DOM.navToggle?.addEventListener('click', this.toggleMobileNav);
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', this.handleNavLinkClick);
            });
            window.addEventListener('scroll', this.handleScrollEvents);
        },
        toggleMobileNav: function () {
            DOM.navMenu?.classList.toggle('active');
            DOM.navToggle?.classList.toggle('active');
        },
        closeMobileNav: function () {
            DOM.navMenu?.classList.remove('active');
            DOM.navToggle?.classList.remove('active');
        },
        handleNavLinkClick: function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            SmoothScroller.to(target);
            NavigationManager.closeMobileNav();
        },
        updateActiveLink: function () {
            const scrollPos = window.scrollY + 70; // Adjusted for navbar height
            DOM.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    DOM.navLinks.forEach(link => link.classList.remove('active'));
                    navLink?.classList.add('active');
                }
            });
        },
        handleNavbarScroll: function () {
            if (window.scrollY > 50) {
                DOM.navbar?.classList.add('scrolled');
            } else {
                DOM.navbar?.classList.remove('scrolled');
            }
        },
        handleScrollEvents: function () {
            NavigationManager.updateActiveLink();
            NavigationManager.handleNavbarScroll();
        }
    };

    // --- 4. Smooth Scrolling (Refactored) ---
    const SmoothScroller = {
        to: function (target) {
            const element = document.querySelector(target);
            if (element) {
                const offsetTop = element.offsetTop - (DOM.navbar?.offsetHeight || 70);
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    };

    // --- 5. Animations and Effects (Grouped & Optimized) ---
    const Effects = {
        init: function () {
            this.initScrollAnimations();
            this.initTypingAnimation();
            this.initParallax();
            this.animateSkills();
            this.animateTimeline();
            this.animateCounters();
        },
        initScrollAnimations: function () {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);
            DOM.animatedElements.forEach(el => {
                el.classList.add('fade-in');
                observer.observe(el);
            });
        },
        initTypingAnimation: function () {
            if (DOM.heroTitle) {
                const originalText = DOM.heroTitle.textContent;
                DOM.heroTitle.textContent = '';
                setTimeout(() => {
                    this.typeWriter(DOM.heroTitle, originalText, 50);
                }, 500);
            }
        },
        typeWriter: function (element, text, speed) {
            let i = 0;
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        },
        initParallax: function () {
            if (DOM.hero && DOM.profileCard) {
                window.addEventListener('scroll', () => {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * -0.5;
                    DOM.profileCard.style.transform = `translateY(${rate}px)`;
                });
            }
        },
        animateSkills: function () {
            DOM.skillItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.animation = 'pulse 0.6s ease';
                });
                item.addEventListener('animationend', () => {
                    item.style.animation = '';
                });
            });
        },
        animateTimeline: function () {
            DOM.timelineItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateX(10px)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateX(0)';
                });
            });
        },
        animateCounters: function () {
            const observerOptions = { threshold: 0.5 };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.textContent.replace(/\D/g, ''));
                        const suffix = counter.textContent.replace(/\d/g, '');
                        let current = 0;
                        const increment = target / 50;
                        const updateCounter = () => {
                            if (current < target) {
                                current += increment;
                                counter.textContent = Math.ceil(current) + suffix;
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target + suffix;
                            }
                        };
                        updateCounter();
                        observer.unobserve(counter);
                    }
                });
            }, observerOptions);
            DOM.statCounters.forEach(counter => observer.observe(counter));
        }
    };

    // --- 6. Form Handling (Refactored) ---
    const FormHandler = {
        init: function () {
            DOM.contactForm?.addEventListener('submit', this.handleFormSubmit);
        },
        handleFormSubmit: function (e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;
        }
    };

    // --- 7. Main Initialization ---
    const App = {
        init: function () {
            ThemeManager.init();
            NavigationManager.init();
            Effects.init();
            FormHandler.init();
            this.handlePageLoad();
        },
        handlePageLoad: function () {
            document.body.style.opacity = '0';
            window.addEventListener('load', () => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            });
        }
    };

    // Initialize the application
    document.addEventListener('DOMContentLoaded', () => App.init());
})();