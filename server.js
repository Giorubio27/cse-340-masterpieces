import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Define the the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));
/**
  * Routes
  */

app.get('/', asyncHandler(async (req, res) => {
    const title = 'Home';
    // If an await here rejects or a throw happens, it flows to your error middleware.
    res.render('home', { title });
}));



app.get('/organizations', asyncHandler(async (req, res) => {
    const title = 'Organizations';
    // If an await here rejects or a throw happens, it flows to your error middleware.
    res.render('organizations', { title });
}));



app.get('/projects', asyncHandler(async (req, res) => {
    const title = 'Service Projects';
    // If an await here rejects or a throw happens, it flows to your error middleware.
    res.render('projects', { title });
}));



app.get('/categories', asyncHandler(async (req, res) => {
    const title = 'Categories';
    // If an await here rejects or a throw happens, it flows to your error middleware.
    res.render('categories', { title });
}));


app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});