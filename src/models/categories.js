import db from './db.js';

const getAllCategories = async () => {
    const query = `SELECT category_id, category_name FROM categories ORDER BY category_name;`;
    const result = await db.query(query);
    return result.rows;
};

const getCategoryById = async (id) => {
    const query = `SELECT category_id, category_name FROM categories WHERE category_id = $1;`;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const getAllCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name
        FROM categories c
        JOIN categories_projects cp ON c.category_id = cp.categories_category_id
        WHERE cp.projects_project_id = $1;`;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getAllProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.date, p.location
        FROM projects p
        JOIN categories_projects cp ON p.project_id = cp.projects_project_id
        WHERE cp.categories_category_id = $1;`;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO categories_projects (categories_category_id, projects_project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM categories_projects
        WHERE projects_project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

export { getAllCategories, getAllProjectsByCategoryId, getCategoryById, getAllCategoriesByProjectId, updateCategoryAssignments }

