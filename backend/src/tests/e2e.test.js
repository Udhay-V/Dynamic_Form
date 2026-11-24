const request = require('supertest');
const app = require('../server');
const prisma = require('../config/db');

describe('E2E Full Flow: Form Builder, Dynamic Rendering & Scalable Submissions', () => {
  let token;
  let formId;
  let submissionId;

  beforeAll(async () => {
    // Login with seeded admin
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@formbuilder.com',
        password: 'AdminPassword123!',
      });
    expect(res.status).toBe(200);
    token = res.body.token;
  });

  afterAll(async () => {
    if (formId) {
      await prisma.form.deleteMany({ where: { id: formId } });
    }
    await prisma.$disconnect();
  });

  test('E2E Step 1: Admin creates a form with all 9 dynamic field types', async () => {
    const payload = {
      name: 'All 9 Field Types Comprehensive Form',
      mail: 'qa@formbuilder.internal',
      gender: 'All',
      mobile: '+1-800-555-9999',
      description: 'End-to-end verification covering all supported field types.',
      department: 'Quality Assurance',
      designation: 'Staff SDET',
      role: 'Test Lead',
      status: 'published',
      fields: [
        { id: 'f_text', key: 'candidateName', label: 'Candidate Name', type: 'TEXT', required: true },
        { id: 'f_email', key: 'candidateEmail', label: 'Candidate Email', type: 'EMAIL', required: true },
        { id: 'f_num', key: 'yearsOfExperience', label: 'Years of Experience', type: 'NUMBER', required: true, validation: { min: 0, max: 50 } },
        { id: 'f_phone', key: 'contactNumber', label: 'Contact Number', type: 'PHONE', required: true },
        { id: 'f_area', key: 'coverLetter', label: 'Cover Letter', type: 'TEXTAREA', required: false },
        { id: 'f_date', key: 'availableStartDate', label: 'Available Start Date', type: 'DATE', required: true },
        { id: 'f_select', key: 'primaryFramework', label: 'Primary Framework', type: 'SELECT', required: true, options: ['React.js', 'Next.js', 'Vue.js'] },
        { id: 'f_radio', key: 'employmentType', label: 'Employment Type', type: 'RADIO', required: true, options: ['Full-Time', 'Contract', 'Part-Time'] },
        { id: 'f_check', key: 'skills', label: 'Technical Skills', type: 'CHECKBOX', required: true, options: ['PostgreSQL', 'Redux Toolkit', 'Node.js', 'Docker'] },
      ],
    };

    const res = await request(app)
      .post('/api/forms')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.form.id).toBeDefined();
    formId = res.body.form.id;
  });

  test('E2E Step 2: Public user fetches dynamic form definition', async () => {
    const res = await request(app).get(`/api/forms/${formId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.form.fields.length).toBe(9);
  });

  test('E2E Step 3: Backend validation intercepts invalid data independently of frontend', async () => {
    const invalidPayload = {
      candidateName: '', // Required empty
      candidateEmail: 'not-an-email', // Bad email
      yearsOfExperience: 999, // Exceeds max 50
      contactNumber: 'abcdef', // Invalid phone
      availableStartDate: 'not-a-date', // Invalid date
      primaryFramework: 'RubyOnRails', // Not in options
      employmentType: 'Freelance', // Not in radio options
      skills: ['Hadoop', 'Cobol'], // Not in checkbox options
    };

    const res = await request(app)
      .post(`/api/forms/${formId}/submissions`)
      .send(invalidPayload);

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.candidateName).toBeDefined();
    expect(res.body.errors.candidateEmail).toBeDefined();
    expect(res.body.errors.yearsOfExperience).toBeDefined();
    expect(res.body.errors.contactNumber).toBeDefined();
    expect(res.body.errors.availableStartDate).toBeDefined();
    expect(res.body.errors.primaryFramework).toBeDefined();
    expect(res.body.errors.employmentType).toBeDefined();
    expect(res.body.errors.skills).toBeDefined();
  });

  test('E2E Step 4: Valid submission successfully recorded in PostgreSQL', async () => {
    const validPayload = {
      candidateName: 'Grace Hopper',
      candidateEmail: 'grace.hopper@example.com',
      yearsOfExperience: 12,
      contactNumber: '+1-555-012-3456',
      coverLetter: 'Passionate about compilers and systems architecture.',
      availableStartDate: '2026-12-01',
      primaryFramework: 'React.js',
      employmentType: 'Full-Time',
      skills: ['PostgreSQL', 'Redux Toolkit', 'Node.js'],
    };

    const res = await request(app)
      .post(`/api/forms/${formId}/submissions`)
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.submissionId).toBeDefined();
    submissionId = res.body.submissionId;
  });

  test('E2E Step 5: Admin accesses paginated submissions and verifies stored data', async () => {
    const res = await request(app)
      .get(`/api/forms/${formId}/submissions?page=1&limit=5`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pagination.total).toBe(1);
    expect(res.body.data[0].id).toBe(submissionId);
    expect(res.body.data[0].data.candidateName).toBe('Grace Hopper');
    expect(res.body.data[0].data.primaryFramework).toBe('React.js');
    expect(res.body.data[0].data.skills).toEqual(['PostgreSQL', 'Redux Toolkit', 'Node.js']);
  });

  test('E2E Step 6: Admin views single submission', async () => {
    const res = await request(app)
      .get(`/api/forms/${formId}/submissions/${submissionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(submissionId);
    expect(res.body.data.data.candidateEmail).toBe('grace.hopper@example.com');
  });

  test('E2E Step 7: Admin deletes submission and deletes form', async () => {
    const delSubRes = await request(app)
      .delete(`/api/forms/${formId}/submissions/${submissionId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(delSubRes.status).toBe(200);

    const delFormRes = await request(app)
      .delete(`/api/forms/${formId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(delFormRes.status).toBe(200);
    formId = null; // Prevent afterAll error
  });
});
