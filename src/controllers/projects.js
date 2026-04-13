// Import any needed model functions
import { getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getAllCategoriesByProjectId } from '../models/categories.js';
import { createProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { updateProject, isUserVolunteering } from '../models/projects.js';
import { validationResult, body } from 'express-validator';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ max: 1000 })
        .withMessage('Project description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty()
        .isLength({ max: 200 })
        .withMessage('Project location is required'),
    body('date')
        .notEmpty()
        .withMessage('Project date is required')
        .isISO8601()
        .withMessage('Please provide a valid date'),
    body('organizationId')
        .notEmpty()
        .isInt()
        .withMessage('Organization ID must be a valid integer')
]

const number_of_upcoming_projects = 5; // You can adjust this number as needed


// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(number_of_upcoming_projects);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

// 4. Create the new controller function for project details
// In projects.js
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const categories = await getAllCategoriesByProjectId(projectId);

    // 1. Determine if the user is logged in
    const isLoggedIn = !!(req.session && req.session.user);

    // 2. Determine if they are already volunteering
    let isVolunteering = false;
    if (isLoggedIn) {
        // Make sure isUserVolunteering is imported at the top of this file
        isVolunteering = await isUserVolunteering(projectId, req.session.user.user_id);
    }

    // 3. Pass EVERYTHING to the view
    res.render('project', {
        title: project.title,
        project,
        categories,
        isLoggedIn,
        isVolunteering,
        user: req.session.user // Ensure the 'user' variable is also passed for your admin checks
    });
};

const showProjectsByOrganization = async (req, res) => {
    const organizationId = req.params.organizationId;
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Project';

    res.render('edit-project', { title, projectDetails, organizations });
}

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Redirect back to the new project form
        return res.redirect(`/edit-project/${projectId}`);
    };

    const { title, description, location, date, organizationId } = req.body;

    await updateProject(projectId, title, description, location, date, organizationId);

    req.flash('success', 'Project updated successfully');

    res.redirect(`/project/${projectId}`);


};


// Export any controller functions
export {
    showProjectsPage,
    showProjectsByOrganization,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};