const prisma = require('../config/db');

/**
 * POST /api/forms
 * Create a new form
 */
const createForm = async (req, res, next) => {
  try {
    const {
      name,
      mail,
      gender,
      mobile,
      description,
      department,
      designation,
      role,
      status = 'draft',
      fields = [],
    } = req.body;

    const form = await prisma.form.create({
      data: {
        name: name.trim(),
        mail: mail ? mail.trim() : null,
        gender: gender || null,
        mobile: mobile ? mobile.trim() : null,
        description: description ? description.trim() : null,
        department: department ? department.trim() : null,
        designation: designation ? designation.trim() : null,
        role: role ? role.trim() : null,
        status: status === 'published' ? 'published' : 'draft',
        fields: Array.isArray(fields) ? fields : [],
        userId: req.user ? req.user.id : null,
      },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: `Form created successfully as ${form.status}`,
      form,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/forms
 * List all forms with pagination, search, and status filter
 */
const listForms = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const { status, search } = req.query;

    const where = {};

    if (status && ['draft', 'published'].includes(status.toLowerCase())) {
      where.status = status.toLowerCase();
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { department: { contains: q, mode: 'insensitive' } },
        { designation: { contains: q, mode: 'insensitive' } },
        { role: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, forms] = await Promise.all([
      prisma.form.count({ where }),
      prisma.form.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { submissions: true },
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: forms,
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
 * GET /api/forms/:id
 * Retrieve a single form definition
 */
const getForm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    // Public users can only view published forms. Admins with token can view drafts.
    const isPublicUser = !req.user;
    if (isPublicUser && form.status !== 'published') {
      return res.status(403).json({
        success: false,
        message: 'This form is currently in Draft mode and is not accepting submissions.',
        isDraft: true,
      });
    }

    return res.status(200).json({
      success: true,
      form,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/forms/:id
 * Update an existing form
 */
const updateForm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingForm = await prisma.form.findUnique({
      where: { id },
    });

    if (!existingForm) {
      return res.status(404).json({
        success: false,
        message: 'Form not found to update',
      });
    }

    const {
      name,
      mail,
      gender,
      mobile,
      description,
      department,
      designation,
      role,
      status,
      fields,
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (mail !== undefined) updateData.mail = mail ? mail.trim() : null;
    if (gender !== undefined) updateData.gender = gender || null;
    if (mobile !== undefined) updateData.mobile = mobile ? mobile.trim() : null;
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (department !== undefined) updateData.department = department ? department.trim() : null;
    if (designation !== undefined) updateData.designation = designation ? designation.trim() : null;
    if (role !== undefined) updateData.role = role ? role.trim() : null;
    if (status !== undefined && ['draft', 'published'].includes(status)) {
      updateData.status = status;
    }
    if (fields !== undefined && Array.isArray(fields)) {
      updateData.fields = fields;
    }

    const updatedForm = await prisma.form.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Form updated successfully',
      form: updatedForm,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/forms/:id
 * Delete a form and its submissions
 */
const deleteForm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingForm = await prisma.form.findUnique({
      where: { id },
    });

    if (!existingForm) {
      return res.status(404).json({
        success: false,
        message: 'Form not found to delete',
      });
    }

    await prisma.form.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: `Form "${existingForm.name}" deleted successfully along with all associated submissions`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createForm,
  listForms,
  getForm,
  updateForm,
  deleteForm,
};
