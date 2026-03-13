# Lumina - Modern Job Portal

A modern job portal connecting talented professionals with forward-thinking companies, powered by MongoDB and Express.

## How This Project Benefits Users

- **For Job Seekers**: Discover relevant opportunities with smart filtering, apply instantly using a saved profile, and track application statuses seamlessly from a personal dashboard. It simplifies the job hunt into a fast, intuitive experience.
- **For Employers**: Eliminate the friction of hiring with easy job posting tools, an organized applicant tracking pipeline, and the ability to review and update candidate statuses in real-time.

## Features

- **Smart Job Search**: Advanced filtering by role, location, salary, and job type
- **Applicant Management**: Track applications, review candidates, and manage hiring pipelines
- **One-Click Apply**: Apply to jobs instantly with your saved profile
- **Easy Job Posting**: Post jobs in minutes with detailed descriptions
- **Secure Authentication**: JWT-based authentication with encrypted passwords
- **Real-Time Updates**: Live data from MongoDB database
- **RESTful API**: Complete backend API for all operations

## Tech Stack

### Frontend

- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- Lucide Icons

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Getting Started / How to Run

### Quick Start

To run this project locally, simply execute the following commands in your terminal:

```bash
# Install all required dependencies
npm install

# (Optional) Seed the database with demo accounts and data
npm run seed

# Start the development server
npm run dev
```

Once the server is running on `http://localhost:5000`, open the `index.html` file in your browser to view the application!

---

### Full Setup Guide

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**

   ```bash
   cd job_portal-adv
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` and update with your MongoDB URI:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

   **Getting MongoDB URI:**
   - **MongoDB Atlas (Cloud - Free)**:
     - Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
     - Create free account and cluster
     - Get connection string
   - **Local MongoDB**:
     - Install MongoDB locally
     - Use: `mongodb://localhost:27017/lumina_job_portal`

4. **Seed the database (Optional but recommended)**

   ```bash
   npm run seed
   ```

   This creates demo accounts and sample jobs.

5. **Start the backend server**

   ```bash
   npm run dev
   ```

   Server will run on http://localhost:5000

6. **Open the frontend**
   - Simply open `index.html` in your browser
   - Or use a local server (e.g., Live Server extension in VS Code)

## Demo Accounts

After running `npm run seed`, you can login with:

- **Employer**:
  - Email: `employer@test.com`
  - Password: `123`

- **Job Seeker**:
  - Email: `user@test.com`
  - Password: `123`

## Project Structure

```
job_portal-adv/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Job.js             # Job model
│   │   └── Application.js     # Application model
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── jobController.js   # Job CRUD operations
│   │   ├── applicationController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   ├── jobs.js           # Job routes
│   │   ├── applications.js   # Application routes
│   │   └── users.js          # User routes
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── server.js             # Main server file
│   └── seed.js               # Database seeding script
├── api.js                    # Frontend API client
├── store.js                  # Data management (uses API)
├── utils.js                  # Utility functions
├── index.html                # Landing page
├── auth.html                 # Authentication page
├── find-job.html             # Job search page
├── seeker-dashboard.html     # Job seeker dashboard
├── employer-dashboard.html   # Employer dashboard
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment template
├── package.json              # Dependencies
└── README.md                 # This file
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Jobs

- `GET /api/jobs` - Get all jobs (with optional filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (employer only)
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)
- `GET /api/jobs/employer/:employerId` - Get jobs by employer

### Applications

- `POST /api/applications` - Apply to job
- `GET /api/applications/job/:jobId` - Get applications for job (employer only)
- `GET /api/applications/seeker/:seekerId` - Get user'sapplications
- `PUT /api/applications/:id/status` - Update application status (employer only)

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (own profile only)

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed database with demo data

## Environment Variables

| Variable      | Description               | Example                            |
| ------------- | ------------------------- | ---------------------------------- |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/lumina` |
| `JWT_SECRET`  | Secret key for JWT tokens | `your_secret_key_here`             |
| `PORT`        | Server port               | `5000`                             |

## Troubleshooting

### Cannot connect to MongoDB

- Make sure MongoDB is running (local) or your Atlas cluster is active
- Check your connection string is correct in `.env`
- Verify network access settings in MongoDB Atlas

### CORS errors

- Ensure the backend server is running
- Check that API_URL in `api.js` matches your server address

### Login not working

- Clear browser localStorage and try again
- Verify MongoDB connection
- Check server console for errors

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please check the console logs for error messages.
