// =============================================
// COSMOSTERIA - Simple Static Site
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // Page Navigation
    // =============================================
    
    function showPage(pageId, postId = null) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Handle blog posts and checkout posts
        if (pageId === 'blog-post' && postId) {
            const blogPage = document.getElementById('blog-post-' + postId);
            if (blogPage) {
                blogPage.classList.add('active');
            }
        } else if (pageId === 'checkout-post' && postId) {
            const checkoutPage = document.getElementById('checkout-post-' + postId);
            if (checkoutPage) {
                checkoutPage.classList.add('active');
            }
        } else {
            // Regular pages
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update URL
        history.pushState(null, '', '#' + pageId);
    }
    
    // Add click handlers to all navigation links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            const postId = this.getAttribute('data-post');
            showPage(pageId, postId);
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.slice(1) || 'home';
        showPage(hash);
    });
    
    // Check for initial hash on page load
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
        showPage(initialHash);
    }
    
    // =============================================
    // Filter Tags (for Library and Cinema)
    // =============================================
    
    document.querySelectorAll('.filter-tags .tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const parent = this.parentElement;
            const filter = this.getAttribute('data-filter');
            
            // Update active state
            parent.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Find the gallery (next sibling with .gallery class)
            let gallery = parent.closest('.card').nextElementSibling;
            while (gallery && !gallery.classList.contains('gallery')) {
                gallery = gallery.nextElementSibling;
            }
            
            if (gallery) {
                gallery.querySelectorAll('.gallery-item').forEach(item => {
                    const itemFilter = item.getAttribute('data-filter') || '';
                    if (filter === 'all' || itemFilter.includes(filter)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // =============================================
    // Lightbox for Images
    // =============================================
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    function openLightbox(src) {
        lightboxImage.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Add click handlers to gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const fullSrc = this.getAttribute('data-full');
            const img = this.querySelector('img');
            const src = fullSrc || (img ? img.src : '');
            if (src) {
                openLightbox(src);
            }
        });
    });
    
    // Close lightbox
    document.getElementById('closeLightbox').addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Escape key closes lightbox
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
    
});
