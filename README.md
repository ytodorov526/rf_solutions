# RF Solutions Web Application

A comprehensive web application for an RF, antenna, and radar engineering company. This application showcases the company's services, products, projects, and provides a contact form for potential clients.

## Features

- Modern, responsive design using Material UI
- Interactive UI with animations and transitions
- Showcase of engineering services, products, and completed projects
- Contact form for client inquiries
- Backend API for data management
- MongoDB database integration

## Tech Stack

### Frontend
- React.js
- Material UI
- React Router
- Axios for API calls
- Recharts for data visualization
- Three.js for 3D visualizations (optional implementation)

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- Multer for file uploads

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas cloud instance)

### Clone the Repository
```bash
git clone https://github.com/yourusername/rf-solutions.git
cd rf-solutions
```

### Backend Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your MongoDB connection string and other configuration.

5. Start the development server:
```bash
npm run dev
```

### Frontend Setup
1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Deployment

### Azure Web App Deployment with GitHub Actions
This project is configured for automated deployment to Azure Web App using GitHub Actions with user-assigned managed identity:

1. **Prerequisites:**
   - Create an Azure Web App service in your Azure Portal (with Node.js 22)
   - Configure a user-assigned managed identity in Azure
   - Set up the following GitHub repository secrets:
     - `AZURE_CLIENT_ID`: The client ID of your user-assigned managed identity
     - `AZURE_TENANT_ID`: Your Azure tenant ID
     - `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID
     - `AZURE_WEBAPP_NAME`: The name of your Azure Web App
   - In GitHub repository settings, under Actions > General, ensure "Workflow permissions" has "Read and write permissions" enabled and "Allow GitHub Actions to create and approve pull requests" is checked

2. **Deployment Process:**
   - Push or merge to the master branch will trigger automated deployment
   - GitHub Actions will build the React client, install server dependencies, and deploy to Azure
   - Authentication uses secure user-assigned managed identity instead of publish profiles
   - The workflow configuration is located in `.github/workflows/azure-deploy.yml`

### Manual Deployment

#### Backend
1. Set up your environment variables on your hosting platform
2. Build and deploy the Node.js application

#### Frontend
1. Build the production version:
```bash
cd client
npm run build
```

2. Deploy the contents of the `build` folder to your web server

## Project Structure

```
rf-solutions/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── assets/         # Images, icons, etc.
│       ├── components/     # Reusable UI components
│       └── pages/          # Page components
├── server/                 # Backend Node.js application
│   ├── src/                # Server source code
│   │   ├── models/         # Mongoose models
│   │   └── routes/         # API routes
│   └── .env.example        # Example environment variables
└── README.md               # Project documentation
```

## Future Enhancements

- User authentication for admin dashboard
- Content management system for updating website content
- Blog section for RF engineering articles
- Interactive RF simulation tools
- Online quote request system
- E-commerce functionality for product sales

## License

[MIT License](LICENSE)

## Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com).