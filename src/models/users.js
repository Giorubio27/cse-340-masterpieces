import db from "./db.js";
import { compare } from "bcrypt";

const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name ASC
    `;
    const result = await db.query(query);
    return result.rows;
};




const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
    INSERT INTO users (name, email, password_hash, role_id)
    VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
    RETURNING user_id
    `;

    const query_params = [name, email, passwordHash, default_role];

    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
    SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
`;
    const query_params = [email];

    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

// Fetch a single user by their ID
const getUserById = async (userId) => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.user_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
};

// Get all projects currently assigned to a specific user
const getProjectsByUserId = async (userId) => {
    const query = `
        SELECT p.project_id, p.title 
        FROM projects p
        JOIN project_assignments pa ON p.project_id = pa.project_id
        WHERE pa.user_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const updateProjectAssignments = async (userId, projectIds) => {
    // Clear existing
    await db.query('DELETE FROM project_assignments WHERE user_id = $1', [userId]);

    // Only insert if there are IDs, otherwise the query will crash
    if (projectIds.length > 0) {
        // Constructing the values string securely
        const values = projectIds.map(pid => `(${pid}, ${userId})`).join(',');
        const query = `INSERT INTO project_assignments (project_id, user_id) VALUES ${values}`;

        console.log("Running Query:", query); // Debugging line
        await db.query(query);
    }
};

const verifyPassword = async (password, passwordHash) => {
    return compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {

    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isPasswordCorrect = await verifyPassword(password, user.password_hash);

    if (isPasswordCorrect) {
        delete user.password_hash;
        return user;
    }

    return null;
}


export { createUser, authenticateUser, getAllUsers, getUserById, getProjectsByUserId, updateProjectAssignments };
