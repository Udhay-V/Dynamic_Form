const prisma = require('../config/db');
const { validateSubmission } = require('../services/validationService');

/**
 * POST /api/forms/:formId/submissions
 * Public or user form submission with rigorous backend validation
 */
const submitForm = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const submittedData = req.body.data !== undefined ? req.body.data : req.body;

    const form = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    // Check if form is published. Allow test submissions only if request has authenticated admin
    const isAuthenticatedAdmin = Boolean(req.user);
    if (form.status !== 'published' && !isAuthenticatedAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Cannot submit to a draft form. Please contact the administrator.',
      });
    }

    // Backend validation against form.fields
    const fields = Array.isArray(form.fields) ? form.fields : [];
    const { isValid, errors, sanitizedData } = validateSubmission(fields, submittedData);

    if (!isValid) {
      return res.status(422).json({
        success: false,
        message: 'Form submission validation failed',
        errors,
      });
    }

    // Capture metadata
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    const submission = await prisma.submission.create({
      data: {
        formId: form.id,
        data: sanitizedData,
        ipAddress: typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : null,
        userAgent,
      },
      select: {
        id: true,
        formId: true,
        data: true,
        submittedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Form submitted successfully!',
      submissionId: submission.id,
      submittedAt: submission.submittedAt,
      data: submission.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/forms/:formId/submissions
 * Admin: List submissions with pagination
 */
const listSubmissions = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { id: true, name: true, fields: true, status: true },
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    const [total, submissions] = await Promise.all([
      prisma.submission.count({
        where: { formId },
      }),
      prisma.submission.findMany({
        where: { formId },
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
      }),
    ]);

    return res.status(200).json({
      success: true,
      form,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/forms/:formId/submissions/:id
 * Admin: Get a single submission by ID
 */
const getSubmission = async (req, res, next) => {
  try {
    const { formId, id } = req.params;

    const submission = await prisma.submission.findFirst({
      where: { id, formId },
      include: {
        form: {
          select: {
            id: true,
            name: true,
            fields: true,
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/forms/:formId/submissions/:id
 * Admin: Delete a single submission
 */
const deleteSubmission = async (req, res, next) => {
  try {
    const { formId, id } = req.params;

    const submission = await prisma.submission.findFirst({
      where: { id, formId },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found to delete',
      });
    }

    await prisma.submission.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitForm,
  listSubmissions,
  getSubmission,
  deleteSubmission,
};
