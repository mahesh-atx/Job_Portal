// --- DATA STORE (Backend API Integration) ---
const Store = {
    currentUser: null,

    async init() {
        // Check if user is logged in (has token)
        const token = API.getToken();
        if (token) {
            try {
                // Verify token and get current user
                const user = await API.auth.getMe();
                this.currentUser = user;
                sessionStorage.setItem('lumina_user', JSON.stringify(user));
            } catch (error) {
                console.error('Session expired or invalid:', error);
                API.removeToken();
                sessionStorage.removeItem('lumina_user');
            }
        } else {
            // Check sessionStorage for backwards compatibility
            const session = sessionStorage.getItem('lumina_user');
            if (session) {
                this.currentUser = JSON.parse(session);
            }
        }
    },

    async register(name, email, password, role, extraField) {
        try {
            const userData = {
                name,
                email,
                password,
                role,
                company: role === 'employer' ? extraField : null,
                bio: role === 'seeker' ? extraField : 'Hiring Manager'
            };

            const user = await API.auth.register(userData);
            
            this.currentUser = user;
            sessionStorage.setItem('lumina_user', JSON.stringify(user));
            
            return user;
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    },

    async login(email, password) {
        try {
            const user = await API.auth.login(email, password);
            
            this.currentUser = user;
            sessionStorage.setItem('lumina_user', JSON.stringify(user));
            
            return user;
        } catch (error) {
            throw new Error(error.message || 'Invalid credentials');
        }
    },

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('lumina_user');
        API.auth.logout();
    },

    async postJob(jobData) {
        try {
            const job = await API.jobs.create(jobData);
            return job;
        } catch (error) {
            throw new Error(error.message || 'Failed to post job');
        }
    },

    async applyToJob(jobId) {
        try {
            const application = await API.applications.apply(jobId);
            return application;
        } catch (error) {
            throw new Error(error.message || 'Failed to apply to job');
        }
    },

    async getJobs(filters = {}) {
        try {
            const jobs = await API.jobs.getAll(filters);
            return jobs;
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            return [];
        }
    },

    async getJobById(jobId) {
        try {
            const job = await API.jobs.getById(jobId);
            return job;
        } catch (error) {
            console.error('Failed to fetch job:', error);
            return null;
        }
    },

    async getMyJobs() {
        try {
            if (!this.currentUser) return [];
            const jobs = await API.jobs.getByEmployer(this.currentUser._id);
            return jobs;
        } catch (error) {
            console.error('Failed to fetch your jobs:', error);
            return [];
        }
    },

    async getMyApplications() {
        try {
            if (!this.currentUser) return [];
            const applications = await API.applications.getForSeeker(this.currentUser._id);
            return applications;
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            return [];
        }
    },

    async getJobApplications(jobId) {
        try {
            const applications = await API.applications.getForJob(jobId);
            return applications;
        } catch (error) {
            console.error('Failed to fetch job applications:', error);
            return [];
        }
    },

    async updateApplicationStatus(appId, status) {
        try {
            const application = await API.applications.updateStatus(appId, status);
            return application;
        } catch (error) {
            throw new Error(error.message || 'Failed to update application status');
        }
    },

    async postJob(jobData) {
        try {
            const job = await API.jobs.create(jobData);
            return job;
        } catch (error) {
            throw new Error(error.message || 'Failed to post job');
        }
    },

    async deleteJob(jobId) {
        try {
            await API.jobs.delete(jobId);
        } catch (error) {
            throw new Error(error.message || 'Failed to delete job');
        }
    },

    async updateJob(jobId, jobData) {
        try {
            const job = await API.jobs.update(jobId, jobData);
            return job;
        } catch (error) {
            throw new Error(error.message || 'Failed to update job');
        }
    },

    async getJobById(jobId) {
        try {
            const job = await API.jobs.getById(jobId);
            return job;
        } catch (error) {
            console.error('Failed to fetch job:', error);
            return null;
        }
    },

    async updateUserProfile(userId, updates) {
        try {
            const user = await API.users.updateProfile(userId, updates);
            
            // Update current user if it's the same
            if (this.currentUser && this.currentUser._id === userId) {
                this.currentUser = { ...this.currentUser, ...user };
                sessionStorage.setItem('lumina_user', JSON.stringify(this.currentUser));
            }
            
            return user;
        } catch (error) {
            throw new Error(error.message || 'Failed to update profile');
        }
    }
};
