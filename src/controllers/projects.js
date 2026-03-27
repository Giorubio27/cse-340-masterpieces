// Import any needed model functions
import { getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails } from '../models/projects.js';


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


// Export any controller functions
export { showProjectsPage, showProjectsByOrganization, showProjectDetailsPage };