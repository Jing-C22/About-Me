// =============================================
// COSMOSTERIA - Personal Website with Admin
// =============================================

// IMPORTANT: Change this password to your own!
const ADMIN_PASSWORD = 'cosmosteria2025';

// =============================================
// Data Management (Local Storage)
// =============================================

const DataStore = {
    get(key) {
        const data = localStorage.getItem(`cosmosteria_${key}`);
        return data ? JSON.parse(data) : [];
    },
    
    set(key, data) {
        localStorage.setItem(`cosmosteria_${key}`, JSON.stringify(data));
    },
    
    add(key, item) {
        const data = this.get(key);
        item.id = Date.now().toString();
        data.unshift(item);
        this.set(key, data);
        return item;
    },
    
    delete(key, id) {
        const data = this.get(key);
        const filtered = data.filter(item => item.id !== id);
        this.set(key, filtered);
    }
};

// =============================================
// Admin Authentication
// =============================================

let isAdmin = false;

function checkAdminStatus() {
    isAdmin = sessionStorage.getItem('cosmosteria_admin') === 'true';
    updateAdminUI();
}

function login(password) {
    if (password === ADMIN_PASSWORD) {
        isAdmin = true;
        sessionStorage.setItem('cosmosteria_admin', 'true');
        updateAdminUI();
        return true;
    }
    return false;
}

function logout() {
    isAdmin = false;
    sessionStorage.removeItem('cosmosteria_admin');
    updateAdminUI();
}

function updateAdminUI() {
    const adminPanel = document.getElementById('adminPanel');
    const adminToggle = document.getElementById('adminToggle');
    
    if (isAdmin) {
        adminPanel.classList.add('active');
        adminToggle.style.color = 'var(--main-bold)';
        adminToggle.style.opacity = '1';
    } else {
        adminPanel.classList.remove('active');
        adminToggle.style.color = '';
        adminToggle.style.opacity = '';
    }
    
    // Refresh current page to show/hide delete buttons
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const pageId = activePage.id;
        if (pageId === 'blog') renderBlogList();
        if (pageId === 'gallery') renderGallery();
        if (pageId === 'drawings') renderDrawings();
        if (pageId === 'home') renderRecentPosts();
    }
}

// =============================================
// Page Navigation
// =============================================

function showPage(pageId, data = null) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Render content based on page
        switch(pageId) {
            case 'home':
                renderRecentPosts();
                break;
            case 'blog':
                renderBlogList();
                break;
            case 'blog-post':
                renderBlogPost(data);
                break;
            case 'gallery':
                renderGallery();
                break;
            case 'drawings':
                renderDrawings();
                break;
        }
    }
}

// =============================================
// Render Functions
// =============================================

function renderRecentPosts() {
    const container = document.getElementById('recentPosts');
    const blogs = DataStore.get('blogs').slice(0, 3);
    const photos = DataStore.get('photos').slice(0, 2);
    const drawings = DataStore.get('drawings').slice(0, 2);
    
    const allItems = [
        ...blogs.map(b => ({ ...b, type: 'blog' })),
        ...photos.map(p => ({ ...p, type: 'photo' })),
        ...drawings.map(d => ({ ...d, type: 'drawing' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    if (allItems.length === 0) {
        container.innerHTML = '<p class="empty-state">No content yet. Add some posts to get started!</p>';
        return;
    }
    
    container.innerHTML = allItems.map(item => {
        const typeLabel = item.type === 'blog' ? '✎' : item.type === 'photo' ? '❐' : '✿';
        const pageDest = item.type === 'blog' ? 'blog-post' : item.type === 'photo' ? 'gallery' : 'drawings';
        
        return `
            <a href="#" class="recent-item" data-page="${pageDest}" ${item.type === 'blog' ? `data-post-id="${item.id}"` : ''}>
                <span class="recent-item-title">${typeLabel} ${escapeHtml(item.title)}</span>
                <span class="recent-item-meta">${formatDate(item.date)}</span>
            </a>
        `;
    }).join('');
    
    // Add click handlers
    container.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            const postId = link.dataset.postId;
            showPage(page, postId);
        });
    });
}

function renderBlogList() {
    const container = document.getElementById('blogList');
    const emptyState = document.getElementById('blogEmpty');
    const blogs = DataStore.get('blogs');
    
    if (blogs.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    container.innerHTML = blogs.map(blog => `
        <div class="blog-card" style="position: relative;">
            ${blog.image ? `<img src="${escapeHtml(blog.image)}" alt="${escapeHtml(blog.title)}" class="blog-card-image">` : ''}
            <div class="blog-card-content">
                <h3 class="blog-card-title">${escapeHtml(blog.title)}</h3>
                <p class="blog-card-date">${formatDate(blog.date)}</p>
                <p class="blog-card-excerpt">${escapeHtml(blog.content.substring(0, 150))}...</p>
            </div>
            <a href="#" class="blog-card-link" data-page="blog-post" data-post-id="${blog.id}" style="position: absolute; inset: 0;"></a>
            ${isAdmin ? `<button class="delete-btn" data-delete="blog" data-id="${blog.id}">&times;</button>` : ''}
        </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('blog-post', link.dataset.postId);
        });
    });
    
    // Add delete handlers
    if (isAdmin) {
        container.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Delete this post?')) {
                    DataStore.delete('blogs', btn.dataset.id);
                    renderBlogList();
                }
            });
        });
    }
}

function renderBlogPost(postId) {
    const container = document.getElementById('blogPostContent');
    const blogs = DataStore.get('blogs');
    const blog = blogs.find(b => b.id === postId);
    
    if (!blog) {
        container.innerHTML = '<p>Post not found.</p>';
        return;
    }
    
    container.innerHTML = `
        <header class="blog-article-header">
            <h1 class="blog-article-title">${escapeHtml(blog.title)}</h1>
            <p class="blog-article-date">${formatDate(blog.date)}</p>
        </header>
        ${blog.image ? `<img src="${escapeHtml(blog.image)}" alt="${escapeHtml(blog.title)}" class="blog-article-image">` : ''}
        <div class="blog-article-content">
            ${blog.content.split('\n').map(p => p.trim() ? `<p>${escapeHtml(p)}</p>` : '').join('')}
        </div>
    `;
}

function renderGallery() {
    const container = document.getElementById('galleryGrid');
    const emptyState = document.getElementById('galleryEmpty');
    const photos = DataStore.get('photos');
    
    if (photos.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    container.innerHTML = photos.map(photo => `
        <div class="gallery-item" data-src="${escapeHtml(photo.url)}" data-caption="${escapeHtml(photo.caption || photo.title)}">
            <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.title)}">
            <div class="gallery-item-overlay">
                <p class="gallery-item-title">${escapeHtml(photo.title)}</p>
                <p class="gallery-item-date">${formatDate(photo.date)}</p>
            </div>
            ${isAdmin ? `<button class="delete-btn" data-delete="photo" data-id="${photo.id}">&times;</button>` : ''}
        </div>
    `).join('');
    
    // Add lightbox handlers
    container.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) return;
            openLightbox(item.dataset.src, item.dataset.caption);
        });
    });
    
    // Add delete handlers
    if (isAdmin) {
        container.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Delete this photo?')) {
                    DataStore.delete('photos', btn.dataset.id);
                    renderGallery();
                }
            });
        });
    }
}

function renderDrawings() {
    const container = document.getElementById('drawingsGrid');
    const emptyState = document.getElementById('drawingsEmpty');
    const drawings = DataStore.get('drawings');
    
    if (drawings.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    container.innerHTML = drawings.map(drawing => `
        <div class="gallery-item" data-src="${escapeHtml(drawing.url)}" data-caption="${escapeHtml(drawing.description || drawing.title)}">
            <img src="${escapeHtml(drawing.url)}" alt="${escapeHtml(drawing.title)}">
            <div class="gallery-item-overlay">
                <p class="gallery-item-title">${escapeHtml(drawing.title)}</p>
                <p class="gallery-item-date">${formatDate(drawing.date)}</p>
            </div>
            ${isAdmin ? `<button class="delete-btn" data-delete="drawing" data-id="${drawing.id}">&times;</button>` : ''}
        </div>
    `).join('');
    
    // Add lightbox handlers
    container.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) return;
            openLightbox(item.dataset.src, item.dataset.caption);
        });
    });
    
    // Add delete handlers
    if (isAdmin) {
        container.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Delete this drawing?')) {
                    DataStore.delete('drawings', btn.dataset.id);
                    renderDrawings();
                }
            });
        });
    }
}

// =============================================
// Lightbox
// =============================================

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImage');
    const cap = document.getElementById('lightboxCaption');
    
    img.src = src;
    cap.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// =============================================
// Modal Management
// =============================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showContentForm(type) {
    document.querySelectorAll('.content-form').forEach(form => {
        form.classList.remove('active');
    });
    
    const titles = {
        blog: 'Add New Blog Post',
        gallery: 'Add New Photo',
        drawing: 'Add New Drawing'
    };
    
    document.getElementById('addContentTitle').textContent = titles[type];
    document.getElementById(`${type}Form`).classList.add('active');
    openModal('addContentModal');
}

// =============================================
// Utility Functions
// =============================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// =============================================
// Event Listeners
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check admin status
    checkAdminStatus();
    
    // Render initial content
    renderRecentPosts();
    
    // Navigation links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(link.dataset.page);
        });
    });
    
    // Admin toggle
    document.getElementById('adminToggle').addEventListener('click', () => {
        if (isAdmin) {
            // If already logged in, just toggle panel visibility
            const panel = document.getElementById('adminPanel');
            panel.classList.toggle('active');
        } else {
            openModal('loginModal');
        }
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        if (login(password)) {
            closeModal('loginModal');
            document.getElementById('adminPassword').value = '';
            document.getElementById('loginError').textContent = '';
        } else {
            document.getElementById('loginError').textContent = 'Incorrect password';
        }
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Close modals
    document.getElementById('closeLogin').addEventListener('click', () => closeModal('loginModal'));
    document.getElementById('closeAddContent').addEventListener('click', () => closeModal('addContentModal'));
    
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });
    
    // Admin buttons
    document.querySelectorAll('[data-type]').forEach(btn => {
        btn.addEventListener('click', () => {
            showContentForm(btn.dataset.type);
        });
    });
    
    // Blog form submission
    document.getElementById('blogForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const blog = {
            title: document.getElementById('blogTitle').value,
            date: document.getElementById('blogDate').value,
            content: document.getElementById('blogContent').value,
            image: document.getElementById('blogImage').value || null
        };
        DataStore.add('blogs', blog);
        closeModal('addContentModal');
        e.target.reset();
        showPage('blog');
    });
    
    // Gallery form submission
    document.getElementById('galleryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const photo = {
            title: document.getElementById('photoTitle').value,
            date: document.getElementById('photoDate').value,
            url: document.getElementById('photoUrl').value,
            caption: document.getElementById('photoCaption').value || null
        };
        DataStore.add('photos', photo);
        closeModal('addContentModal');
        e.target.reset();
        showPage('gallery');
    });
    
    // Drawing form submission
    document.getElementById('drawingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const drawing = {
            title: document.getElementById('drawingTitle').value,
            date: document.getElementById('drawingDate').value,
            url: document.getElementById('drawingUrl').value,
            description: document.getElementById('drawingDescription').value || null
        };
        DataStore.add('drawings', drawing);
        closeModal('addContentModal');
        e.target.reset();
        showPage('drawings');
    });
    
    // Lightbox
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') closeLightbox();
    });
    
    // Escape key closes modals and lightbox
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        }
    });
});
