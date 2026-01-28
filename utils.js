// Utility functions for navigation, toast, and form handling

const Utils = {
    // Navigate to a different page
    navigate(page) {
        window.location.href = page;
    },

    // Show toast notification
    toast(msg) {
        const toastEl = document.getElementById('toast');
        const messageEl = document.getElementById('toast-message');
        if (toastEl && messageEl) {
            messageEl.innerText = msg;
            toastEl.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => toastEl.classList.add('translate-y-20', 'opacity-0'), 3000);
        }
    },

    // Initialize Lucide icons
    initIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },

    // Check authentication and redirect if needed
    requireAuth(requiredRole = null) {
        Store.init();
        if (!Store.currentUser) {
            this.navigate('auth.html');
            return false;
        }
        if (requiredRole && Store.currentUser.role !== requiredRole) {
            this.navigate('auth.html');
            return false;
        }
        return true;
    },

    // Redirect if already logged in
    redirectIfAuthenticated() {
        Store.init();
        if (Store.currentUser) {
            const dashboardPage = Store.currentUser.role === 'employer' ? 
                'employer-dashboard.html' : 'seeker-dashboard.html';
            this.navigate(dashboardPage);
            return true;
        }
        return false;
    },

    // Extract form data as object
    getFormData(form) {
        const formData = new FormData(form);
        return Object.fromEntries(formData);
    },

    // Update navigation bar
    updateNav(isAuthenticated, currentPage) {
        const navLinks = document.getElementById('nav-links');
        const authButtons = document.getElementById('auth-buttons');
        const mobileNav = document.getElementById('mobile-nav-links');

        if (!navLinks || !authButtons) return;

        if (isAuthenticated && Store.currentUser) {
            const isEmployer = Store.currentUser.role === 'employer';
            const dashboardPage = isEmployer ? 'employer-dashboard.html' : 'seeker-dashboard.html';
            const initial = Store.currentUser.name.charAt(0).toUpperCase();
            const gradientClass = isEmployer ? 'from-blue-500 to-purple-600' : 'from-green-500 to-teal-600';
            
            // Hide Dashboard/Find Jobs links everywhere as requested
            navLinks.innerHTML = isEmployer ? `<a href="employer-dashboard.html#post-job" class="text-zinc-500 hover:text-zinc-900 font-medium">Post a Job</a>` : '';

            authButtons.innerHTML = `
                <div class="relative group">
                    <div class="flex items-center gap-2 cursor-pointer">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white hover:ring-zinc-200 transition">
                            ${initial}
                        </div>
                    </div>
                    
                    <!-- Dropdown Menu -->
                    <div class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-zinc-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div class="p-3 border-b border-zinc-100">
                            <div class="font-bold text-sm text-zinc-900">${Store.currentUser.name}</div>
                            <div class="text-xs text-zinc-500">${Store.currentUser.email}</div>
                            <div class="text-xs text-zinc-400 mt-0.5">${isEmployer ? 'Employer Account' : 'Job Seeker'}</div>
                        </div>
                        <div class="py-2">
                            <a href="${dashboardPage}" class="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition">
                                <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                                <span>Dashboard</span>
                            </a>
                            <button onclick="event.stopPropagation(); ${isEmployer ? 'showEditProfileForm()' : 'showEditProfileForm()'};" class="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition text-left">
                                <i data-lucide="user" class="w-4 h-4"></i>
                                <span>Edit Profile</span>
                            </button>
                        </div>
                        <div class="border-t border-zinc-100 py-2">
                            <button onclick="Utils.handleLogout()" class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left">
                                <i data-lucide="log-out" class="w-4 h-4"></i>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Re-initialize icons for the dropdown
            this.initIcons();
        } else {
            navLinks.innerHTML = `
                <a href="index.html" class="text-zinc-500 hover:text-zinc-900 font-medium">Home</a>
                <a href="find-job.html" class="text-zinc-500 hover:text-zinc-900 font-medium">Find Jobs</a>
            `;
            authButtons.innerHTML = `
                <button onclick="Utils.openAuthModal('login')" class="text-zinc-600 hover:text-zinc-900 font-medium px-3 py-2">Log in</button>
                <button onclick="Utils.navigate('auth.html')" class="bg-zinc-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-zinc-800 transition shadow-sm">Sign up</button>
            `;
        }
        
        // Mirror to mobile
        if (mobileNav) {
            mobileNav.innerHTML = navLinks.innerHTML + (isAuthenticated ? 
                `<button onclick="Utils.handleLogout()" class="text-left text-red-600 font-medium py-2">Sign Out</button>` : '');
        }
    },

    // Open authentication modal
    openAuthModal(mode = 'login') {
        const modal = document.getElementById('auth-modal');
        if (!modal) {
            console.error('Auth modal not found in the page');
            return;
        }
        
        // Set the mode
        if (window.switchAuthMode) {
            window.switchAuthMode(mode);
        }
        
        // Show modal with animation
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.querySelector('.modal-panel').classList.remove('translate-x-full');
            modal.querySelector('.modal-overlay').classList.remove('opacity-0');
        }, 10);
    },

    // Close authentication modal
    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        
        const panel = modal.querySelector('.modal-panel');
        const overlay = modal.querySelector('.modal-overlay');
        
        panel.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    },

    // Handle logout
    handleLogout() {
        Store.logout();
        this.toast('Logged out successfully');
        setTimeout(() => this.navigate('index.html'), 1000);
    }
};
