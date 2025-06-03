// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// Hamburger menu functionality
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
}

// Scroll Animation
function handleScrollAnimation() {
    const sections = document.querySelectorAll('.section, .product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add is-visible class when element enters viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Remove is-visible class when element leaves viewport
                entry.target.classList.remove('is-visible');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '-50px' // Adds a small threshold before triggering
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-toggle').textContent = '☀️';
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Navigation functionality
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show selected section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.remove('hidden');

            // Close mobile menu if open
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Product card click functionality
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const modal = document.getElementById('purchaseModal');
            
            // Check if it's a Robux package or regular product
            const isRobuxPackage = this.querySelector('.robux-package') !== null;
            
            if (isRobuxPackage) {
                const robuxAmount = this.querySelector('.robux-amount').textContent;
                const gamepassPrice = this.querySelector('.gamepass-price').textContent;
                const pesoAmount = this.querySelector('.peso-amount').textContent;
                
                // Update modal content for Robux package
                modal.querySelector('.modal-product-name').textContent = `${robuxAmount} Robux`;
                modal.querySelector('.modal-product-price').innerHTML = `${pesoAmount} (<span class="robux-icon"></span>${gamepassPrice.replace('GP: ', '')})`;
                modal.querySelector('.modal-product-icon').className = 'modal-product-icon package-icon';
            } else {
                const productName = this.querySelector('.product-name').textContent;
                const productPrice = this.querySelector('.product-price').textContent.trim().match(/\d+/)[0];
                const pesoPrice = this.querySelector('.peso-price').textContent;
                const productIcon = this.querySelector('.product-icon').className;

                // Update modal content for regular product
                modal.querySelector('.modal-product-name').textContent = productName;
                modal.querySelector('.modal-product-price').innerHTML = `<span class="robux-icon"></span>${productPrice} (${pesoPrice})`;
                modal.querySelector('.modal-product-icon').className = 'modal-product-icon ' + productIcon;
            }

            // Reset modal state and show it
            modal.style.display = 'flex';
            modal.classList.remove('hiding');
            // Use requestAnimationFrame to ensure display: flex is applied before adding show class
            requestAnimationFrame(() => {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });
    });

    // Modal close functionality with animation
    const modal = document.getElementById('purchaseModal');
    const closeModal = document.querySelector('.close-modal');

    function hideModal() {
        modal.classList.add('hiding');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Wait for the animation to complete
        const handleAnimationEnd = () => {
            modal.classList.remove('show', 'hiding');
            modal.style.display = 'none';
            modal.removeEventListener('animationend', handleAnimationEnd);
        };

        modal.addEventListener('animationend', handleAnimationEnd, { once: true });
    }

    closeModal.addEventListener('click', hideModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });

    handleScrollAnimation();
});