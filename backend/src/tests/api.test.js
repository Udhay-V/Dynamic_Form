const request = require('supertest');
const app = require('../server');
const prisma = require('../config/db');

describe('Full-Stack Form Builder & Submission API Integration Tests', () => {
  let adminToken;
  let testFormId;
  let testSubmissionId;

  beforeAll(async () => {
    // Authenticate with seeded admin
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@formbuilder.com',
        password: 'AdminPassword123!',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  afterAll(async () => {
    // Clean up test form if created
    if (testFormId) {
      await prisma.form.deleteMany({ where: { id: testFormId } });
    }
    await prisma.$disconnect();
  });

  test('1. GET /health should return 200 ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('2. GET /api/forms should list forms', async () => {
    const res = await request(app)
      .get('/api/forms')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  test('3. POST /api/forms should create a new dynamic form with fields', async () => {
    const payload = {
      name: 'Event RSVP Test Form',
      mail: 'events@company.com',
      gender: 'Any',
      mobile: '+1-555-987-6543',
      description: 'RSVP Form for Annual Developer Summit',
      department: 'Engineering',
      designation: 'Tech Lead',
      role: 'Organizer',
      status: 'published',
      fields: [
        {
          id: 't1',
          key: 'attendeeName',
          label: 'Full Name',
          type: 'TEXT',
          required: true,
          placeholder: 'Enter full name',
        },
        {
          id: 't2',
          key: 'attendeeEmail',
          label: 'Attendee Email',
          type: 'EMAIL',
          required: true,
        },
        {
          id: 't3',
          key: 'ticketCount',
          label: 'Tickets',
          type: 'NUMBER',
          required: true,
          validation: { min: 1, max: 5 },
        },
        {
          id: 't4',
          key: 'dietaryPreference',
          label: 'Dietary Preference',
          type: 'SELECT',
          required: true,
          options: ['Standard', 'Vegetarian', 'Vegan', 'Gluten-Free'],
        },
        {
          id: 't5',
          key: 'attendanceMode',
          label: 'Attendance Mode',
          type: 'RADIO',
          required: true,
          options: ['In-Person', 'Virtual'],
        },
        {
          id: 't6',
          key: 'workshopTracks',
          label: 'Workshop Tracks',
          type: 'CHECKBOX',
          required: false,
          options: ['AI & LLMs', 'Cloud Native', 'Cybersecurity'],
        },
      ],
    };

    const res = await request(app)
      .post('/api/forms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.form.id).toBeDefined();
    expect(res.body.form.name).toBe(payload.name);
    testFormId = res.body.form.id;
  });

  test('4. POST /api/forms/:formId/submissions validation rejects missing required fields', async () => {
    const res = await request(app)
      .post(`/api/forms/${testFormId}/submissions`)
      .send({
        attendeeName: '', // empty required
        attendeeEmail: 'invalid-email-address',
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.attendeeName).toBeDefined();
    expect(res.body.errors.attendeeEmail).toBeDefined();
  });

  test('5. POST /api/forms/:formId/submissions validation rejects invalid SELECT / RADIO option', async () => {
    const res = await request(app)
      .post(`/api/forms/${testFormId}/submissions`)
      .send({
        attendeeName: 'Jane Doe',
        attendeeEmail: 'jane@example.com',
        ticketCount: 2,
        dietaryPreference: 'NonExistentFoodOption',
        attendanceMode: 'OuterSpace', // invalid radio
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.dietaryPreference).toBeDefined();
    expect(res.body.errors.attendanceMode).toBeDefined();
  });

  test('6. POST /api/forms/:formId/submissions accepts valid submission data', async () => {
    const validData = {
      attendeeName: 'Jane Doe',
      attendeeEmail: 'jane.doe@example.com',
      ticketCount: 2,
      dietaryPreference: 'Vegetarian',
      attendanceMode: 'In-Person',
      workshopTracks: ['AI & LLMs', 'Cloud Native'],
    };

    const res = await request(app)
      .post(`/api/forms/${testFormId}/submissions`)
      .send(validData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.submissionId).toBeDefined();
    expect(res.body.data.attendeeName).toBe('Jane Doe');
    expect(res.body.data.ticketCount).toBe(2);
    testSubmissionId = res.body.submissionId;
  });

  test('7. GET /api/forms/:formId/submissions lists submissions with pagination', async () => {
    const res = await request(app)
      .get(`/api/forms/${testFormId}/submissions?page=1&limit=10`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].id).toBe(testSubmissionId);
  });

  test('8. GET /api/forms/:formId/submissions/:id retrieves single submission', async () => {
    const res = await request(app)
      .get(`/api/forms/${testFormId}/submissions/${testSubmissionId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(testSubmissionId);
    expect(res.body.data.data.attendeeEmail).toBe('jane.doe@example.com');
  });

  test('9. DELETE /api/forms/:formId/submissions/:id deletes submission', async () => {
    const res = await request(app)
      .delete(`/api/forms/${testFormId}/submissions/${testSubmissionId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify deletion
    const verifyRes = await request(app)
      .get(`/api/forms/${testFormId}/submissions/${testSubmissionId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(verifyRes.status).toBe(404);
  });

  test('10. PUT /api/forms/:id updates form metadata and draft/publish toggle', async () => {
    const res = await request(app)
      .put(`/api/forms/${testFormId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'draft',
        description: 'Updated description for the summit event.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.form.status).toBe('draft');
    expect(res.body.form.description).toBe('Updated description for the summit event.');
  });
});
