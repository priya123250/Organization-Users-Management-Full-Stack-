const { Organization, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get all organizations with user counts
exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      include: [{
        model: User,
        as: 'users',
        attributes: ['id']
      }],
      order: [['created_at', 'DESC']]
    });

    // Format response with user count
    const formattedOrgs = organizations.map(org => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      email: org.email,
      contact: org.contact,
      status: org.status,
      pending_requests: org.users ? org.users.length : 0,
      created_at: org.created_at,
      updated_at: org.updated_at
    }));

    res.json({
      success: true,
      data: formattedOrgs
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching organizations',
      error: error.message
    });
  }
};

// Get organization by ID with users
exports.getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const organization = await Organization.findByPk(id, {
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'name', 'email', 'role', 'created_at']
      }]
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    res.json({
      success: true,
      data: organization
    });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching organization',
      error: error.message
    });
  }
};

// Create new organization
exports.createOrganization = async (req, res) => {
  try {
    const { name, slug, email, contact } = req.body;

    // Validation
    if (!name || !slug || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug, and email are required'
      });
    }

    // Check if slug already exists
    const existingOrg = await Organization.findOne({ where: { slug } });
    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: 'Organization with this slug already exists'
      });
    }

    const organization = await Organization.create({
      name,
      slug,
      email,
      contact,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: organization
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating organization',
      error: error.message
    });
  }
};

// Update organization
exports.updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const organization = await Organization.findByPk(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    await organization.update(updates);

    res.json({
      success: true,
      message: 'Organization updated successfully',
      data: organization
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating organization',
      error: error.message
    });
  }
};

// Update organization status
exports.updateOrganizationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'blocked', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const organization = await Organization.findByPk(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    await organization.update({ status });

    res.json({
      success: true,
      message: 'Organization status updated successfully',
      data: organization
    });
  } catch (error) {
    console.error('Error updating organization status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating organization status',
      error: error.message
    });
  }
};

// Delete organization
exports.deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await Organization.findByPk(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    await organization.destroy();

    res.json({
      success: true,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting organization',
      error: error.message
    });
  }
};
