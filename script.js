/*
    cosmosteria scripts
    navigation, filters, lightbox
*/

document.addEventListener('DOMContentLoaded', function() {
    
    // ~~ page navigation ~~
    
    function showPage(pageId, postId = null) {
        // hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // figure out which page to show
        if (pageId === 'blog-post' && postId) {
            const page = document.getElementById('blog-post-' + postId);
            if (page) page.classList.add('active');
        } else if (pageId === 'bake-post' && postId) {
            const page = document.getElementById('bake-post-' + postId);
            if (page) page.classList.add('active');
        } else if (pageId === 'treasure-post' && postId) {
            const page = document.getElementById('treasure-post-' + postId);
            if (page) page.classList.add('active');
        } else {
            const page = document.getElementById(pageId);
            if (page) page.classList.add('active');
        }
        
        // scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // update url
        history.pushState(null, '', '#' + pageId);
    }
    
    // click handlers
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(this.getAttribute('data-page'), this.getAttribute('data-post'));
        });
    });
    
    // browser back/forward
    window.addEventListener('popstate', function() {
        showPage(window.location.hash.slice(1) || 'home');
    });
    
    // check for hash on load
    if (window.location.hash) {
        showPage(window.location.hash.slice(1));
    }
    
    // ~~ filter tags ~~
    
    document.querySelectorAll('.filter-tags .tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const parent = this.parentElement;
            const filter = this.getAttribute('data-filter');
            
            // update active tag
            parent.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // find gallery
            let gallery = parent.closest('.card').nextElementSibling;
            while (gallery && !gallery.classList.contains('gallery')) {
                gallery = gallery.nextElementSibling;
            }
            
            // filter items
            if (gallery) {
                gallery.querySelectorAll('.gallery-item').forEach(item => {
                    const itemFilter = item.getAttribute('data-filter') || '';
                    item.style.display = (filter === 'all' || itemFilter.includes(filter)) ? '' : 'none';
                });
            }
        });
    });
    
    // ~~ lightbox ~~
    
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
    
    // gallery clicks
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const src = this.getAttribute('data-full') || this.querySelector('img')?.src;
            if (src) openLightbox(src);
        });
    });
    
    // close lightbox
    document.getElementById('closeLightbox').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
    
});
