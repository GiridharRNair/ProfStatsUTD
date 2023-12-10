
## Prerequisites

Before you begin contributing to this project, make sure you have the following software installed on your machine:

- Docker
- Node.js
- Python

## Installation and Setup Guide for ProfStatsUTD Project

To successfully set up the ProfStatsUTD project on your local machine, follow the steps outlined below:

### 1. **Clone the Repository:**

   ```bash
   git clone https://github.com/GiridharRNair/ProfStatsUTD.git
   ```

### 2. **Navigate to the Project Directory:**

   ```bash
   cd ProfStatsUTD
   ```

### 3. **Install Project Dependencies:**

   This project employs the `concurrently` package to run the backend and frontend components simultaneously. Check the `package.json` file in the root directory for more details.

   ```bash
   npm install
   ```

### 4. **Set Up Python Environment:**

   Before proceeding, ensure you have a dedicated environment for the Python backend located in the `/api` directory. Choose between Conda or virtual environment (venv) and follow the respective guidelines:

   - For Conda, refer to the [Conda documentation](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html).

   - For venv, consult the [Python documentation](https://docs.python.org/3/library/venv.html).

   Once your environment is set up, install the required Python packages alongside the frontend dependencies using:

   ```bash
   npm run install-packages
   ```

### 5. **Start the Extension in Your Browser:**

   To concurrently initiate both the backend and frontend components of the extension from the root directory, run:

   ```bash
   npm start
   ```

### 6. **Build Chrome Extension Packages:**

   Build the packages for the Chrome extension by running:

   ```bash
   npm run preview
   ```

   This command orchestrates the backend within a Docker container and activates the React frontend in build mode. After execution, load the unpacked extension in your browser by selecting `/extension/dist`.

You are now set up and ready to contribute to the ProfStatsUTD project. If you encounter any issues or have questions, don't hesitate to seek assistance from the project maintainers. 

## Configuration

The project does not demand any particular configuration. However, take note of the following environment variables:

The frontend (extension) utilizes two environment files: `.env.production` for production and `.env` for local development. These files house the backend endpoint, which dynamically changes depending on whether the project is executed locally or within a Docker container. 

In the `.env.production` file, the backend endpoint aligns with the Docker file configuration, while in the `.env` file, it corresponds to the local endpoint for running the project locally.

Modify the environment variables within these files according to your specific use case.

## Testcases

Please note that currently, there are no test cases available in the ProfStatsUTD project. However, we highly encourage contributions in this area. If you are interested in enhancing the project by introducing test cases, your efforts would be greatly appreciated.

## Contributing Workflow

1. Fork the repository on GitHub.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure they pass the tests.
4. Commit your changes and push them to your fork.
5. Submit a pull request to the main repository, explaining the purpose and details of your changes.

Thank you for contributing to our project! If you have any questions or need assistance, feel free to reach out to the maintainers.