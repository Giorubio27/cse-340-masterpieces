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
import { processAssignCategoriesForm, showAssignCategoriesForm } from './categories.js';
import { showCategoriesPage, showCategoryDetailsPage, showNewCategoryForm, processNewCategoryForm, categoryValidation } from './categories.js';
import { testErrorPage } from './errors.js';

import { projectValidation } from './projects.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.get('/new-project', showNewProjectForm);
router.get('/new-category', showNewCategoryForm);
router.get('/edit-project/:id', showEditProjectForm);
// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);
router.post('/assign-categories/:projectId', projectValidation, processAssignCategoriesForm);



// error-handling routes
router.get('/test-error', testErrorPage);
// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);


// 2. Add the new route for the project details page
// The ':id' is a route parameter that will be passed to your controller
router.get('/project/:id', showProjectDetailsPage);


export default router;