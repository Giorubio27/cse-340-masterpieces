// Import any needed model functions
import { getAllProjects } from '../models/projects.js';
import { getProjectsByOrganizationId } from '../models/projects.js';


// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

const showProjectsByOrganization = async (req, res) => {
    const organizationId = req.params.organizationId;
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};




// Export any controller functions
export { showProjectsPage, showProjectsByOrganization };