// Import any needed model functions
import { getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getAllCategoriesByProjectId } from '../models/categories.js';
import { createProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
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
const showProjectDetailsPage = async (req, res, next) => {
    // Extract the service project ID from the URL parameters
    const projectId = req.params.id;

    // Retrieve the specific project using the model function
    const project = await getProjectDetails(projectId);

    if (!project) {
        const error = new Error('Project not found');
        error.status = 404;
        return next(error); // Pass the error to the error-handling middleware

    }

    const categories = await getAllCategoriesByProjectId(projectId);


    // Render the new view (project.ejs) and pass the data
    res.render('project', { title: project.title, project, categories });
};

const showProjectsByOrganization = async (req, res) => {
    const organizationId = req.params.organizationId;
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Create New Service Project';

    res.render('new-project', { title, organizations });
};

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

    try {
        // Create a new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'Project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating project:', error);
        req.flash('error', 'Failed to create project. Please try again.');
        res.redirect('/new-project');
    }
}


// Export any controller functions
export {
    showProjectsPage,
    showProjectsByOrganization,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm, 
    projectValidation
};