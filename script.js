// Page Navigation Handler
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('[data-page]');
    const pages = document.querySelectorAll('.page');
    
    // Function to show a specific page
    function showPage(pageId) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Add click handlers to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
            
            // Update URL hash
            history.pushState(null, '', '#' + targetPage);
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
    
    // Filter tags functionality
    const filterTags = document.querySelectorAll('.filter-tags .tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active from siblings in the same filter group
            const parent = this.parentElement;
            parent.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Sort tags functionality
    const sortTags = document.querySelectorAll('.sort-tags .tag');
    sortTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active from siblings in the same sort group
            const parent = this.parentElement;
            parent.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Guestbook form handler (demo)
    const gbMessage = document.querySelector('.gb-message');
    if (gbMessage) {
        gbMessage.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const name = document.querySelector('.gb-name').value || 'anon';
                const message = this.value;
                
                if (message.trim()) {
                    const entriesContainer = document.querySelector('.guestbook-entries');
                    const newEntry = document.createElement('div');
                    newEntry.className = 'entry';
                    newEntry.innerHTML = `
                        <span class="name">${escapeHtml(name)}</span>
                        <span class="entry-text">${escapeHtml(message)}</span>
                        <span class="time">just now</span>
                    `;
                    entriesContainer.insertBefore(newEntry, entriesContainer.firstChild);
                    
                    // Clear inputs
                    document.querySelector('.gb-name').value = '';
                    this.value = '';
                }
            }
        });
    }
    
    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Add subtle hover effect to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // Could open a lightbox here in a full implementation
                console.log('Gallery item clicked:', img.alt);
            }
        });
    });
});
