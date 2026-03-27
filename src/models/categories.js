import db from './db.js';

export const getAllCategories = async () => {
    const query = `SELECT category_id, category_name FROM categories ORDER BY category_name;`;
    const result = await db.query(query);
    return result.rows;
};

export const getCategoryById = async (id) => {
    const query = `SELECT category_id, category_name FROM categories WHERE category_id = $1;`;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

export const getAllCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name
        FROM categories c
        JOIN categories_projects cp ON c.category_id = cp.categories_category_id
        WHERE cp.projects_project_id = $1;`;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

export const getAllProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.date, p.location
        FROM projects p
        JOIN categories_projects cp ON p.project_id = cp.projects_project_id
        WHERE cp.categories_category_id = $1;`;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

// import db from './db.js';

// const getAllCategories = async () => {
//     const query = `SELECT category_name FROM categories
//     ORDER BY category_name;`;

//     const result = await db.query(query);

//     return result.rows;
// };

// const getCategoryById = async (id) => {
//     const query = `SELECT category_id, category_name FROM categories
//     WHERE category_id = $1;`;

//     const result = await db.query(query, [id]);
//     return result.rows[0]; // Returns a single category object
// };

// const getAllCategoriesByProjectId = async (projectId) => {
//     const query = `SELECT c.category_id, c.category_name
//     FROM categories c
//     JOIN categories_projects cp ON c.category_id = cp.categories_category_id
//     WHERE cp.projects_project_id = $1;`;

//     const result = await db.query(query, [projectId]);
//     return result.rows;
// };

// const getAllProjectsByCategoryId = async (categoryId) => {
//     const query = `SELECT p.project_id, p.title, p.description, p.date, p.location, o.name AS organization_name
//     FROM projects p
//     JOIN categories_projects cp ON p.project_id = cp.projects_project_id
//     WHERE cp.categories_category_id = $1;`;

//     const result = await db.query(query, [categoryId]);
//     return result.rows;
// };


// export { getAllCategories, getCategoryById, getAllCategoriesByProjectId, getAllProjectsByCategoryId };