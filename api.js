// API Client for Lumina Job Portal Backend
const API_URL = '/api';

const API = {
  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('lumina_token');
  },

  // Set auth token
  setToken(token) {
    localStorage.setItem('lumina_token', token);
  },

  // Remove auth token
  removeToken() {
    localStorage.removeItem('lumina_token');
  },

  // Make API request with error handling
  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Authentication
  auth: {
    async register(userData) {
      const data = await API.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      if (data.token) {
        API.setToken(data.token);
      }
      
      return data;
    },

    async login(email, password) {
      const data = await API.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (data.token) {
        API.setToken(data.token);
      }
      
      return data;
    },

    async getMe() {
      return await API.request('/auth/me');
    },

    logout() {
      API.removeToken();
    }
  },

  // Jobs
  jobs: {
    async getAll(filters = {}) {
      const params = new URLSearchParams(filters);
      const query = params.toString() ? `?${params.toString()}` : '';
      return await API.request(`/jobs${query}`);
    },

    async getById(id) {
      return await API.request(`/jobs/${id}`);
    },

    async create(jobData) {
      return await API.request('/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData)
      });
    },

    async update(id, jobData) {
      return await API.request(`/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(jobData)
      });
    },

    async delete(id) {
      return await API.request(`/jobs/${id}`, {
        method: 'DELETE'
      });
    },

    async getByEmployer(employerId) {
      return await API.request(`/jobs/employer/${employerId}`);
    }
  },

  // Applications
  applications: {
    async apply(jobData) {
      // jobData can be an object { jobId, resume } or just jobId (legacy support)
      const body = typeof jobData === 'string' ? { jobId: jobData } : jobData;
      return await API.request('/applications', {
        method: 'POST',
        body: JSON.stringify(body)
      });
    },

    async getForJob(jobId) {
      return await API.request(`/applications/job/${jobId}`);
    },

    async getForSeeker(seekerId) {
      return await API.request(`/applications/seeker/${seekerId}`);
    },

    async updateStatus(applicationId, status) {
      return await API.request(`/applications/${applicationId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    }
  },

  // Users
  users: {
    async getProfile(userId) {
      return await API.request(`/users/${userId}`);
    },

    async updateProfile(userId, updates) {
      return await API.request(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    }
  },

  // Uploads
  upload: {
    async resume(file) {
      const formData = new FormData();
      formData.append('resume', file);
      
      const token = API.getToken();
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      try {
        const response = await fetch(`${API_URL}/upload/resume`, {
          method: 'POST',
          headers, // Let browser set Content-Type with boundary for FormData
          body: formData
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error uploading file');
        }
        
        return data; // { message, url }
      } catch (error) {
        console.error('Upload Error:', error);
        throw error;
      }
    }
  }
};
