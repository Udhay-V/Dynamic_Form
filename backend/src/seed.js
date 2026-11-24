require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('./config/db');

async function seed() {
  console.log('🌱 Starting database seed...');

  // 1. Create or update Default Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('AdminPassword123!', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@formbuilder.com' },
    update: { password: hashedPassword },
    create: {
      name: 'System Administrator',
      email: 'admin@formbuilder.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log(`👤 Admin user ready: ${admin.email}`);

  // 2. Create Published Example Form (Customer Registration)
  const customerFormFields = [
    {
      id: 'f1',
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your first name',
    },
    {
      id: 'f2',
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'you@example.com',
    },
    {
      id: 'f3',
      key: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: ['Male', 'Female', 'Other'],
    },
    {
      id: 'f4',
      key: 'mobile',
      label: 'Mobile Phone',
      type: 'phone',
      required: false,
      placeholder: '+1-555-123-4567',
    },
    {
      id: 'f5',
      key: 'satisfactionRating',
      label: 'Satisfaction Rating (1-10)',
      type: 'number',
      required: false,
      validation: { min: 1, max: 10 },
      placeholder: 'Rate from 1 to 10',
    },
    {
      id: 'f6',
      key: 'preferredContact',
      label: 'Preferred Contact Method',
      type: 'radio',
      required: true,
      options: ['Email', 'Phone', 'SMS'],
    },
    {
      id: 'f7',
      key: 'interests',
      label: 'Interested Topics',
      type: 'checkbox',
      required: false,
      options: ['Product Updates', 'Discounts & Offers', 'Beta Program'],
    },
    {
      id: 'f8',
      key: 'dob',
      label: 'Date of Birth',
      type: 'date',
      required: false,
    },
    {
      id: 'f9',
      key: 'feedback',
      label: 'Additional Feedback',
      type: 'textarea',
      required: false,
      placeholder: 'Share any extra comments here...',
    },
  ];

  const customerForm = await prisma.form.create({
    data: {
      name: 'Customer Registration',
      mail: 'contact@customerrelations.com',
      gender: 'Any',
      mobile: '+1-800-555-0199',
      description: 'Customer intake form to register new users and gather contact preferences and feedback.',
      department: 'Customer Relations',
      designation: 'Operations Lead',
      role: 'Administrator',
      status: 'published',
      fields: customerFormFields,
      userId: admin.id,
    },
  });

  console.log(`📋 Published Form created: "${customerForm.name}" (ID: ${customerForm.id})`);

  // 3. Create Sample Submissions for Customer Registration
  const sampleSubmissions = [
    {
      firstName: 'Alice',
      email: 'alice.johnson@example.com',
      gender: 'Female',
      mobile: '+1-202-555-0143',
      satisfactionRating: 9,
      preferredContact: 'Email',
      interests: ['Product Updates', 'Beta Program'],
      dob: '1992-05-14',
      feedback: 'The platform is intuitive and easy to navigate.',
    },
    {
      firstName: 'Bob',
      email: 'bob.smith@example.com',
      gender: 'Male',
      mobile: '+1-202-555-0188',
      satisfactionRating: 8,
      preferredContact: 'Phone',
      interests: ['Discounts & Offers'],
      dob: '1988-11-20',
      feedback: 'Customer service was very helpful when answering my questions.',
    },
    {
      firstName: 'Carol',
      email: 'carol.danvers@example.com',
      gender: 'Female',
      mobile: '+1-202-555-0177',
      satisfactionRating: 10,
      preferredContact: 'Email',
      interests: ['Product Updates', 'Discounts & Offers', 'Beta Program'],
      dob: '1995-03-08',
      feedback: 'Super fast form load times and seamless dynamic fields!',
    },
    {
      firstName: 'David',
      email: 'david.miller@example.com',
      gender: 'Male',
      mobile: '+1-202-555-0192',
      satisfactionRating: 7,
      preferredContact: 'SMS',
      interests: ['Product Updates'],
      dob: '1990-09-12',
      feedback: 'Overall good experience.',
    },
  ];

  for (const sub of sampleSubmissions) {
    await prisma.submission.create({
      data: {
        formId: customerForm.id,
        data: sub,
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
  }

  console.log(`📥 Created ${sampleSubmissions.length} sample submissions`);

  // 4. Create Draft Form (Employee Onboarding)
  const draftForm = await prisma.form.create({
    data: {
      name: 'Employee Onboarding (Internal)',
      mail: 'hr@company.internal',
      gender: 'All',
      mobile: '+1-888-555-0144',
      description: 'Internal draft form for new employee personnel records.',
      department: 'Human Resources',
      designation: 'HR Coordinator',
      role: 'Staff Lead',
      status: 'draft',
      fields: [
        { id: 'e1', key: 'fullName', label: 'Full Legal Name', type: 'text', required: true },
        { id: 'e2', key: 'corporateEmail', label: 'Corporate Email', type: 'email', required: true },
        { id: 'e3', key: 'startDate', label: 'Start Date', type: 'date', required: true },
        { id: 'e4', key: 'officeLocation', label: 'Office Location', type: 'select', required: true, options: ['New York', 'London', 'Bangalore', 'Remote'] },
      ],
      userId: admin.id,
    },
  });

  console.log(`📝 Draft Form created: "${draftForm.name}" (ID: ${draftForm.id})`);
  console.log('✅ Seed completed successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
