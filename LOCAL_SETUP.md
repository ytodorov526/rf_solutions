# RF Solutions Web Application - Local Setup Guide

This guide will help you set up and run the RF Solutions web application on your local machine.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Download the Project

1. Download the entire project directory from the current environment to your local machine.

2. Extract the files if they're in a compressed format.

## Directory Structure

After extraction, you should have the following structure:
```
rf-solutions/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # UI components
│   │   └── pages/          # Page components
├── server/                 # Backend Node.js application
│   ├── src/                # Server source code
│   │   ├── models/         # Mongoose models
│   │   └── routes/         # API routes
│   └── .env.example        # Environment variables template
├── run_demo.sh             # Demo startup script
└── README.md               # Project documentation
```

## Running the Application Locally

### Option 1: Running the Mock Data Demo (No Database Required)

1. Open a terminal and navigate to the project directory:
   ```
   cd path/to/rf-solutions
   ```

2. Install the server dependencies:
   ```
   cd server
   npm install
   ```

3. Start the demo server:
   ```
   node src/index.js
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

5. You'll see the API documentation page and can test the API endpoints.

### Option 2: Running the Full Application

#### Backend Setup

1. Navigate to the server directory:
   ```
   cd path/to/rf-solutions/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up MongoDB:
   - Install MongoDB locally OR
   - Create a free MongoDB Atlas account (cloud)
   - Create a database named "rf-solutions"

4. Create a `.env` file:
   ```
   cp .env.example .env
   ```

5. Edit the `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/rf-solutions
   ```
   Or use your MongoDB Atlas connection string.

6. Start the server:
   ```
   npm start
   ```

#### Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```
   cd path/to/rf-solutions/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

4. The application should automatically open in your browser at:
   ```
   http://localhost:3000
   ```

## Exploring the Application

Once running, you can explore the different features:

1. Home page with hero section and service overview
2. Products page showcasing RF equipment
3. Services page with detailed offerings
4. Projects portfolio with filterable showcase
5. Contact page with form submission

## Building for Production

To create a production build:

1. Build the React frontend:
   ```
   cd path/to/rf-solutions/client
   npm run build
   ```

2. Configure the server for production in the .env file:
   ```
   NODE_ENV=production
   ```

3. Start the server:
   ```
   cd path/to/rf-solutions/server
   npm start
   ```

4. Access the production build at:
   ```
   http://localhost:5000
   ```

## Troubleshooting

- If you encounter port conflicts, edit the PORT variable in the .env file
- For MongoDB connection issues, check your connection string and ensure MongoDB is running
- For React dependency issues, try running `npm install --legacy-peer-deps`

## Support

For issues or questions, refer to the project documentation or create an issue in the project repository.