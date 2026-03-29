import express from 'express';

import { showNewOrganizationForm } from './organizations.js';
import { showHomePage } from './index.js';
import { showOrganizationsPage } from './organizations.js';
import { showOrganizationDetailsPage } from './organizations.js';

import { showProjectDetailsPage, showProjectsPage } from './projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './categories.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);



// error-handling routes
router.get('/test-error', testErrorPage);
// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);


// 2. Add the new route for the project details page
// The ':id' is a route parameter that will be passed to your controller
router.get('/project/:id', showProjectDetailsPage);


export default router;