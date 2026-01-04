/*
    ✿ cosmosteria scripts ✿
*/

document.addEventListener('DOMContentLoaded', function() {
    
    // page navigation
    function showPage(pageId, postId = null) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        let targetId = pageId;
        if (postId) {
            targetId = pageId + '-' + postId;
        }
        
        const page = document.getElementById(targetId);
        if (page) page.classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.pushState(null, '', '#' + pageId);
    }
    
    // click handlers
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(this.getAttribute('data-page'), this.getAttribute('data-post'));
        });
    });
    
    // browser navigation
    window.addEventListener('popstate', () => {
        showPage(window.location.hash.slice(1) || 'home');
    });
    
    // check hash on load
    if (window.location.hash) {
        showPage(window.location.hash.slice(1));
    }
    
    // filter tags
    document.querySelectorAll('.filter-tags .tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const parent = this.parentElement;
            const filter = this.getAttribute('data-filter');
            
            parent.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            let gallery = parent.closest('.card').nextElementSibling;
            while (gallery && !gallery.classList.contains('gallery')) {
                gallery = gallery.nextElementSibling;
            }
            
            if (gallery) {
                gallery.querySelectorAll('.gallery-item').forEach(item => {
                    const f = item.getAttribute('data-filter') || '';
                    item.style.display = (filter === 'all' || f.includes(filter)) ? '' : 'none';
                });
            }
        });
    });
    
    // lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const src = this.getAttribute('data-full') || this.querySelector('img')?.src;
            if (src) {
                lightboxImg.src = src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    document.getElementById('closeLightbox').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
});
