// --- DATA STORE (Simulated Backend) ---
const Store = {
    db: {
        users: [],
        jobs: [],
        applications: []
    },
    currentUser: null,

    init() {
        const stored = localStorage.getItem('lumina_db');
        if (stored) {
            this.db = JSON.parse(stored);
            // Re-seed if we only have the initial few jobs (fix for existing users)
            if (this.db.jobs.length <= 3) {
                this.seedData();
            }
        } else {
            // Seed initial data
            this.seedData();
        }
        const session = sessionStorage.getItem('lumina_user');
        if (session) this.currentUser = JSON.parse(session);
    },

    save() {
        localStorage.setItem('lumina_db', JSON.stringify(this.db));
    },

    seedData() {
        // Create some mock data
        this.db.users = [
            { id: 'u1', name: 'TechFlow Inc.', email: 'employer@test.com', password: '123', role: 'employer', company: 'TechFlow Inc.', bio: 'We build the infrastructure for the next generation of internet companies.' },
            { id: 'u2', name: 'Jane Doe', email: 'user@test.com', password: '123', role: 'seeker', skills: ['JavaScript', 'React'], bio: 'Senior Frontend Developer with 5 years experience.' }
        ];
        
        const desc1 = `
<h4 class="text-lg font-bold text-zinc-900 mb-2">About the Role</h4>
<p class="mb-4">We are looking for a visionary Senior Product Designer to join our core team. You will be responsible for defining the user experience across our entire product suite.</p>

<h4 class="text-lg font-bold text-zinc-900 mb-2">Key Responsibilities</h4>
<ul class="list-disc pl-5 mb-4 space-y-1">
    <li>Lead design projects from concept to launch.</li>
    <li>Collaborate closely with engineers and product managers.</li>
    <li>Conduct user research and usability testing.</li>
    <li>Create high-fidelity prototypes and design systems.</li>
</ul>

<h4 class="text-lg font-bold text-zinc-900 mb-2">Requirements</h4>
<ul class="list-disc pl-5 mb-4 space-y-1">
    <li>5+ years of experience in product design.</li>
    <li>Strong portfolio showcasing web and mobile work.</li>
    <li>Proficiency in Figma and prototyping tools.</li>
</ul>`;

        const desc2 = `
<h4 class="text-lg font-bold text-zinc-900 mb-2">The Opportunity</h4>
<p class="mb-4">Join a fast-paced team building high-performance web applications. We need a React expert who cares about code quality and performance.</p>

<h4 class="text-lg font-bold text-zinc-900 mb-2">What you'll do</h4>
<ul class="list-disc pl-5 mb-4 space-y-1">
    <li>Architect and build scalable frontend components.</li>
    <li>Optimize applications for maximum speed.</li>
    <li>Mentor junior developers.</li>
</ul>`;

        const descGeneric = `<p class="mb-4">We are looking for a talented individual to join our team. If you are passionate about your work and want to make an impact, we'd love to hear from you.</p>`;

        this.db.jobs = [
            { id: 'j1', employerId: 'u1', title: 'Senior Product Designer', type: 'Full-time', salary: '$120k - $150k', location: 'Remote', description: desc1, postedAt: new Date().toISOString() },
            { id: 'j2', employerId: 'u1', title: 'Frontend Engineer', type: 'Contract', salary: '$60/hr', location: 'New York, NY', description: desc2, postedAt: new Date(Date.now() - 86400000).toISOString() },
            { id: 'j3', employerId: 'u1', title: 'Marketing Manager', type: 'Full-time', salary: '$90k - $110k', location: 'London, UK', description: descGeneric, postedAt: new Date(Date.now() - 172800000).toISOString() },
            { id: 'j4', employerId: 'u1', title: 'Backend Developer (Go)', type: 'Full-time', salary: '$130k - $160k', location: 'San Francisco, CA', description: descGeneric, postedAt: new Date(Date.now() - 200000000).toISOString() },
            { id: 'j5', employerId: 'u1', title: 'UX Researcher', type: 'Part-time', salary: '$50/hr', location: 'Remote', description: descGeneric, postedAt: new Date(Date.now() - 250000000).toISOString() },
            { id: 'j6', employerId: 'u1', title: 'Sales Representative', type: 'Full-time', salary: '$60k + Commission', location: 'Austin, TX', description: descGeneric, postedAt: new Date(Date.now() - 300000000).toISOString() },
            { id: 'j7', employerId: 'u1', title: 'DevOps Engineer', type: 'Full-time', salary: '$140k - $170k', location: 'Remote', description: descGeneric, postedAt: new Date(Date.now() - 350000000).toISOString() },
            { id: 'j8', employerId: 'u1', title: 'Content Writer', type: 'Freelance', salary: '$0.20/word', location: 'Remote', description: descGeneric, postedAt: new Date(Date.now() - 400000000).toISOString() },
            { id: 'j9', employerId: 'u1', title: 'HR Manager', type: 'Full-time', salary: '$85k - $100k', location: 'Chicago, IL', description: descGeneric, postedAt: new Date(Date.now() - 450000000).toISOString() },
            { id: 'j10', employerId: 'u1', title: 'Mobile Developer (iOS)', type: 'Full-time', salary: '$125k - $155k', location: 'New York, NY', description: descGeneric, postedAt: new Date(Date.now() - 500000000).toISOString() },
            { id: 'j11', employerId: 'u1', title: 'Data Scientist', type: 'Full-time', salary: '$135k - $165k', location: 'Boston, MA', description: descGeneric, postedAt: new Date(Date.now() - 550000000).toISOString() },
            { id: 'j12', employerId: 'u1', title: 'Project Manager', type: 'Contract', salary: '$80k - $110k', location: 'Seattle, WA', description: descGeneric, postedAt: new Date(Date.now() - 600000000).toISOString() },
            { id: 'j13', employerId: 'u1', title: 'Customer Support Lead', type: 'Full-time', salary: '$70k - $90k', location: 'Remote', description: descGeneric, postedAt: new Date(Date.now() - 650000000).toISOString() },
            { id: 'j14', employerId: 'u1', title: 'QA Engineer', type: 'Full-time', salary: '$90k - $110k', location: 'Denver, CO', description: descGeneric, postedAt: new Date(Date.now() - 700000000).toISOString() },
            { id: 'j15', employerId: 'u1', title: 'Social Media Manager', type: 'Part-time', salary: '$25/hr', location: 'Remote', description: descGeneric, postedAt: new Date(Date.now() - 750000000).toISOString() }
        ];
        this.save();
    },

    register(name, email, password, role, extraField) {
        if (this.db.users.find(u => u.email === email)) throw new Error('Email already exists');
        
        const user = { 
            id: 'u' + Date.now(), 
            name, 
            email, 
            password, 
            role, 
            company: role === 'employer' ? extraField : null, 
            bio: role === 'seeker' ? extraField : 'Hiring Manager',
            skills: [] 
        };
        
        this.db.users.push(user);
        this.save();
        this.login(email, password);
    },

    login(email, password) {
        const user = this.db.users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error('Invalid credentials');
        this.currentUser = user;
        sessionStorage.setItem('lumina_user', JSON.stringify(user));
        return user;
    },

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('lumina_user');
    },

    postJob(jobData) {
        // Ensure description handles newlines if plain text
        let desc = jobData.description;
        if (!desc.includes('<p>')) {
            desc = desc.split('\n').map(line => line.trim() ? `<p class="mb-2">${line}</p>` : '').join('');
        }

        const job = { id: 'j' + Date.now(), employerId: this.currentUser.id, postedAt: new Date().toISOString(), ...jobData, description: desc };
        this.db.jobs.unshift(job); // Add to top
        this.save();
    },

    applyToJob(jobId) {
        if (this.db.applications.find(a => a.jobId === jobId && a.seekerId === this.currentUser.id)) {
            throw new Error('Already applied');
        }
        const application = {
            id: 'a' + Date.now(),
            jobId,
            seekerId: this.currentUser.id,
            employerId: this.db.jobs.find(j => j.id === jobId).employerId,
            status: 'Applied', // Applied, Reviewing, Interview, Rejected, Hired
            appliedAt: new Date().toISOString()
        };
        this.db.applications.push(application);
        this.save();
    },

    getJobs() { return this.db.jobs; },
    getMyJobs() { return this.db.jobs.filter(j => j.employerId === this.currentUser.id); },
    getMyApplications() { return this.db.applications.filter(a => a.seekerId === this.currentUser.id); },
    getJobApplications(jobId) { return this.db.applications.filter(a => a.jobId === jobId); },
    
    
    updateApplicationStatus(appId, status) {
        const app = this.db.applications.find(a => a.id === appId);
        if (app) {
            app.status = status;
            this.save();
        }
    },

    deleteJob(jobId) {
        // Remove the job
        this.db.jobs = this.db.jobs.filter(j => j.id !== jobId);
        // Remove all applications for this job
        this.db.applications = this.db.applications.filter(a => a.jobId !== jobId);
        this.save();
    },

    updateJob(jobId, jobData) {
        const job = this.db.jobs.find(j => j.id === jobId);
        if (job) {
            // Update job fields
            let desc = jobData.description;
            if (!desc.includes('<p>')) {
                desc = desc.split('\n').map(line => line.trim() ? `<p class="mb-2">${line}</p>` : '').join('');
            }
            
            Object.assign(job, jobData, { description: desc });
            this.save();
        }
    },

    getJobById(jobId) {
        return this.db.jobs.find(j => j.id === jobId);
    },

    updateUserProfile(userId, updates) {
        const user = this.db.users.find(u => u.id === userId);
        if (user) {
            Object.assign(user, updates);
            // Update current user if it's the same
            if (this.currentUser && this.currentUser.id === userId) {
                Object.assign(this.currentUser, updates);
                sessionStorage.setItem('lumina_user', JSON.stringify(this.currentUser));
            }
            this.save();
        }
    }
};
