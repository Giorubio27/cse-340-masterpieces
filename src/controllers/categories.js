// Import any needed model functions
import { getAllCategories, getAllProjectsByCategoryId, getAllCategoriesByProjectId, getCategoryById, updateCategoryAssignments, createNewCategory } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { validationResult, body } from 'express-validator';

const categoryValidation = [
    body('category_name')
        .trim()
        .notEmpty()
        .withMessage('category name is required')
];
        
        
// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getAllProjectsByCategoryId(categoryId);

    res.render('category', { title: category.category_name, category, projects });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getAllCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', title);
}

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Loop through validation errors and flash them
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });
    
            // Redirect back to the new project form
            return res.redirect('/new-category');
        }

    const { categoryName } = req.body;

    try {
        const newCategoryId = await createNewCategory(categoryName);
        req.flash('success', 'New was created successfully!');
        res.redirect(`/project/${newCategoryId}`);
    } catch (error) {
        console.error('Error creating new category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    };
}




// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    categoryValidation
};