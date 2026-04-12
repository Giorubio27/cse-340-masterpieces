import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers, getUserById, getProjectsByUserId, updateProjectAssignments } from '../models/users.js';
import { getAllProjects } from '../models/projects.js';
import { addVolunteer, removeVolunteer } from '../models/projects.js';


const showUserRegistrationForm = async (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userId = await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occured during registration. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm = async (req, res) => {
    res.render('login', { title: 'Login' });

};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

const requireLogin = async (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access this page');
        return res.redirect('/login')
    }
    next();
};

// const showDashboard = async (req, res, next) => {
//     const user = req.session.user;
//     res.render('dashboard', {
//         title: 'Dashboard',
//         name: user.name,
//         email: user.email
//     });
// };

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users-list', { // Create this view next
        title: 'User Management',
        users: users
    });
};

const showAssignProjectsForm = async (req, res) => {
    const userId = req.params.userId;

    const userDetails = await getUserById(userId);
    const projects = await getAllProjects(); // Imported from your projects model
    const assignedProjects = await getProjectsByUserId(userId);

    const title = `Assign Projects to ${userDetails.name}`;

    res.render('assign-projects', {
        title,
        userId,
        userDetails,
        projects,
        assignedProjects
    });
};

const processAssignProjectsForm = async (req, res) => {
    const userId = parseInt(req.params.userId); // Ensure this is a number
    const selectedProjectIds = req.body.projectIds || [];

    // 1. Convert to array and 2. Map to integers
    const projectIdsArray = (Array.isArray(selectedProjectIds) ? selectedProjectIds : [selectedProjectIds])
        .map(id => parseInt(id));

    console.log("Processing IDs for User:", userId, "Project IDs:", projectIdsArray);

    try {
        await updateProjectAssignments(userId, projectIdsArray);
        req.flash('success', 'User project assignments updated successfully.');
        res.redirect('/users');
    } catch (error) {
        console.error("Assignment Error:", error);
        req.flash('error', 'Failed to update assignments.');
        res.redirect(`/assign-projects/${userId}`);
    }
};

const volunteerAction = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.user_id;
    const action = req.path.includes('join') ? 'add' : 'remove';

    if (action === 'add') {
        await addVolunteer(projectId, userId);
        req.flash('success', 'You are now volunteering for this project!');
    } else {
        await removeVolunteer(projectId, userId);
        req.flash('success', 'You have removed yourself from this project.');
    }
    res.redirect(`/project/${projectId}`);
};

const showDashboard = async (req, res) => {
    const user = req.session.user;
    const volunteeredProjects = await getProjectsByUserId(user.user_id); // Using the function we created earlier

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email,
        volunteeredProjects
    });
};


export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage,
    showAssignProjectsForm, processAssignProjectsForm,
    volunteerAction
};