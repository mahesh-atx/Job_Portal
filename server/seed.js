require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    
    console.log('👤 Creating demo users...');
    
    // Create demo users
  const employer = await User.create({
    name: 'Tech Company',
    email: 'employer@test.com',
    password: 'password123',
    role: 'employer',
    company: 'Tech Innovations Inc.',
    bio: 'Leading technology company focused on innovation and growth'
  });

  const seeker = await User.create({
    name: 'John Seeker',
    email: 'user@test.com',
    password: 'password123',
    role: 'seeker',
    bio: 'Experienced software developer looking for new opportunities',
    skills: ['JavaScript', 'React', 'Node.js']
  });
    
    console.log('💼 Creating demo jobs...');
    
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
    
    const jobs = [
      { title: 'Senior Product Designer', type: 'Full-time', salary: '$120k - $150k', location: 'Remote', description: desc1, postedAt: new Date() },
      { title: 'Frontend Engineer', type: 'Contract', salary: '$60/hr', location: 'New York, NY', description: desc2, postedAt: new Date(Date.now() - 86400000) },
      { title: 'Marketing Manager', type: 'Full-time', salary: '$90k - $110k', location: 'London, UK', description: descGeneric, postedAt: new Date(Date.now() - 172800000) },
      { title: 'Backend Developer (Go)', type: 'Full-time', salary: '$130k - $160k', location: 'San Francisco, CA', description: descGeneric, postedAt: new Date(Date.now() - 200000000) },
      { title: 'UX Researcher', type: 'Part-time', salary: '$50/hr', location: 'Remote', description: descGeneric, postedAt: new Date(Date.now() - 250000000) },
      { title: 'Sales Representative', type: 'Full-time', salary: '$60k + Commission', location: 'Austin, TX', description: descGeneric, postedAt: new Date(Date.now() - 300000000) },
      { title: 'DevOps Engineer', type: 'Full-time', salary: '$140k - $170k', location: 'Remote', description: descGeneric, postedAt: new Date(Date.now() - 350000000) },
      { title: 'Content Writer', type: 'Freelance', salary: '$0.20/word', location: 'Remote', description: descGeneric, postedAt: new Date(Date.now() - 400000000) },
      { title: 'HR Manager', type: 'Full-time', salary: '$85k - $100k', location: 'Chicago, IL', description: descGeneric, postedAt: new Date(Date.now() - 450000000) },
      { title: 'Mobile Developer (iOS)', type: 'Full-time', salary: '$125k - $155k', location: 'New York, NY', description: descGeneric, postedAt: new Date(Date.now() - 500000000) },
      { title: 'Data Scientist', type: 'Full-time', salary: '$135k - $165k', location: 'Boston, MA', description: descGeneric, postedAt: new Date(Date.now() - 550000000) },
      { title: 'Project Manager', type: 'Contract', salary: '$80k - $110k', location: 'Seattle, WA', description: descGeneric, postedAt: new Date(Date.now() - 600000000) },
      { title: 'Customer Support Lead', type: 'Full-time', salary: '$70k - $90k', location: 'Remote', description: descGeneric, postedAt: new Date(Date.now() - 650000000) },
      { title: 'QA Engineer', type: 'Full-time', salary: '$90k - $110k', location: 'Denver, CO', description: descGeneric, postedAt: new Date(Date.now() - 700000000) },
      { title: 'Social Media Manager', type: 'Part-time', salary: '$25/hr', location: 'Remote', description: descGeneric, postedAt: new Date(Date.now() - 750000000) }
    ];
    
    for (const jobData of jobs) {
      await Job.create({
        ...jobData,
        employerId: employer._id
      });
    }
    
    console.log('✅ Database seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Users created: 2`);
    console.log(`   - Jobs created: ${jobs.length}`);
    console.log(`\n🔐 Demo credentials:`)
    console.log(`   Employer: employer@test.com / password123`);
    console.log(`   Seeker: user@test.com / password123\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
