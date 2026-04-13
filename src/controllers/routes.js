import express from 'express';


import { showHomePage } from './index.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm
    , processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './organizations.js';
import { showNewProjectForm, processNewProjectForm } from './projects.js';
import { showProjectDetailsPage, showProjectsPage } from './projects.js';
import { showEditProjectForm, processEditProjectForm } from './projects.js';
import { showAssignProjectsForm, processAssignProjectsForm } from './users.js';
import { processAssignCategoriesForm, showAssignCategoriesForm } from './categories.js';
import { showCategoriesPage, showCategoryDetailsPage, showNewCategoryForm, processNewCategoryForm, categoryValidation, showEditCategoryForm, processEditCategoryForm } from './categories.js';
import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, requireRole, showUsersPage } from './users.js';
import { volunteerAction } from './users.js';
import { testErrorPage } from './errors.js';

import { projectValidation } from './projects.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/category/:id', showCategoryDetailsPage);
// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.get('/assign-projects/:userId', requireRole('admin'), showAssignProjectsForm)
router.get('/register', showUserRegistrationForm);
router.get('/users', requireRole('admin'), showUsersPage);
router.get('/login', showLoginForm);
router.get('/logout', processLogout);

// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.get('/projects/join/:projectId', requireLogin, volunteerAction);
router.get('/projects/leave/:projectId', requireLogin, volunteerAction);
// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
router.post('/assign-categories/:projectId', requireRole('admin'), projectValidation, processAssignCategoriesForm);
router.post('/assign-projects/:userId', requireRole('admin'), projectValidation, processAssignProjectsForm)
router.post('/register', processUserRegistrationForm);
router.post('/login', processLoginForm);



// error-handling routes
router.get('/test-error', testErrorPage);
// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);


// 2. Add the new route for the project details page
// The ':id' is a route parameter that will be passed to your controller
router.get('/project/:id', showProjectDetailsPage);


export default router;