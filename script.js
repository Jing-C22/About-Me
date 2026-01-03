/*
    cosmosteria scripts
    handles page navigation, filters, and lightbox
*/

document.addEventListener('DOMContentLoaded', function() {
    
    // ~~ page navigation ~~
    
    function showPage(pageId, postId = null) {
        // hide all pages first
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // figure out which page to show
        if (pageId === 'blog-post' && postId) {
            const blogPage = document.getElementById('blog-post-' + postId);
            if (blogPage) blogPage.classList.add('active');
        } else if (pageId === 'checkout-post' && postId) {
            const checkoutPage = document.getElementById('checkout-post-' + postId);
            if (checkoutPage) checkoutPage.classList.add('active');
        } else {
            const targetPage = document.getElementById(pageId);
            if (targetPage) targetPage.classList.add('active');
        }
        
        // scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // update the url
        history.pushState(null, '', '#' + pageId);
    }
    
    // click handlers for all nav links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            const postId = this.getAttribute('data-post');
            showPage(pageId, postId);
        });
    });
    
    // handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.slice(1) || 'home';
        showPage(hash);
    });
    
    // check if there's a hash in the url on page load
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
        showPage(initialHash);
    }
    
    // ~~ filter tags (library & cinema) ~~
    
    document.querySelectorAll('.filter-tags .tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const parent = this.parentElement;
            const filter = this.getAttribute('data-filter');
            
            // update which tag looks active
            parent.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // find the gallery
            let gallery = parent.closest('.card').nextElementSibling;
            while (gallery && !gallery.classList.contains('gallery')) {
                gallery = gallery.nextElementSibling;
            }
            
            // show/hide items based on filter
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
    
    // ~~ lightbox for images ~~
    
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
    
    // click on gallery items to open lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const fullSrc = this.getAttribute('data-full');
            const img = this.querySelector('img');
            const src = fullSrc || (img ? img.src : '');
            if (src) openLightbox(src);
        });
    });
    
    // close lightbox
    document.getElementById('closeLightbox').addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });
    
    // esc key closes lightbox
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
    });
    
});
