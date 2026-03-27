import db from './db.js';

const getAllCategories = async () => {
    const query = `SELECT category_name FROM categories
    ORDER BY category_name;`;

    const result = await db.query(query);

    return result.rows;
};

const getCategoryById = async (id) => {
    const query = `SELECT category_id, category_name FROM categories
    WHERE category_id = $1;`;

    const result = await db.query(query, [id]);
    return result.rows[0]; // Returns a single category object
};

const getAllCategoriesByProjectId = async (projectId) => {
    const query = `SELECT c.category_id, c.category_name
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1;`;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getAllProjectsByCategoryId = async (categoryId) => {
    const query = `SELECT p.project_id, p.title, p.description, p.date, p.location, o.name AS organization_name
    FROM projects p
    JOIN project_categories pc ON p.project_id = pc.project_id
    WHERE pc.category_id = $1;`;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};


export { getAllCategories, getCategoryById, getAllCategoriesByProjectId, getAllProjectsByCategoryId };