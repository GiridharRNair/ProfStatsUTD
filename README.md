<h1 align="center">ProfStatsUTD</h1>

<p align="center">
ProfStats is an extension that combines professor ratings from RateMyProfessor.com and grade distributions from UTDgrades.com into a single, convenient location. This allows students to easily and quickly access important information about their professors during the course registration season.
</p>

<p align="center">
  <img src="assets/extension-screenshot-1.jpg" alt="Screenshot" width="400">
</p>

[![Static Badge](https://img.shields.io/badge/Featured_on-Chrome_Web_Store-cce7e8?style=for-the-badge)](https://chromewebstore.google.com/detail/profstats-ut-dallas/doilmgfedjlpepeaolcfpdmkehecdaff)
[![Static Badge](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://raw.githubusercontent.com/GiridharRNair/ProfStatsUTD/main/LICENSE)

## API Overview

[![Static Badge](https://img.shields.io/badge/Deployed_on-Azure-0089D6?style=for-the-badge)](https://profstatsutd.azurewebsites.net/docs)
[![Static Badge](https://img.shields.io/badge/Powered_by-FastAPI-009688?style=for-the-badge)](https://fastapi.tiangolo.com/)
[![Static Badge](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge)](https://www.sqlite.org/index.html)
[![Static Badge](https://img.shields.io/badge/Containerized_with-Docker-2496ED?style=for-the-badge)](https://www.docker.com/)
[![Static Badge](https://img.shields.io/badge/CI/CD_with-GitHub_Actions-2088FF?style=for-the-badge)](https://github.com/features/actions)

### Technologies Used
- **FastAPI in Python:** The backend is developed using FastAPI, a modern web framework for building high-performance APIs with Python 3.7+.
- **Azure Web App Deployment:** Hosted on Azure Web App, deployed through CI/CD, courtesy of my Azure Student Developer account.

### Endpoints

#### 1. Professor Information
- **Endpoint:** `/professor_info`
- **Description:** Retrieve information about a professor, including grades and ratings.
- **Parameters:**
  - `teacher` (string): Professor's name.
  - `course` (optional, string): Course name for additional filtering.

#### 2. Professor Suggestions
- **Endpoint:** `/professor_suggestions`
- **Description:** Retrieve a list of professors that match the given query.
- **Parameters:**
  - `teacher` (string): Query string for professor names.

#### 3. Professor's Courses
- **Endpoint:** `/professor_courses`
- **Description:** Retrieve a list of courses taught by the given professor.
- **Parameters:**
  - `teacher` (string): Professor's name.

### Code Structure

#### `main.py`
- Main FastAPI application file with endpoints for professor-related information.

#### `professor.py`
- Interacts with the RateMyProfessor GraphQL API to obtain professor rating information.

### Data Storage
- The backend employs an SQLite3 database (`utdgrades.sqlite3`) to store and consolidate grade distribution data pertaining to professors, sourced from the [UTDgrades repository](https://github.com/acmutd/utd-grades).

### CORS Configuration
- Cross-Origin Resource Sharing (CORS) is selectively enabled, permitting access for the ProfStats Chrome extension and the local development server during frontend development.

**Note:** The majority of the features are implemented in the backend for quick fixes and updates using CI/CD. This is handy becasue pushing a new version of the extension to the Chrome Web Store takes a few days.

## Extension Overview

[![Static Badge](https://img.shields.io/badge/Powered_by-Chakra_UI-319795?style=for-the-badge)](https://chakra-ui.com/)
[![Static Badge](https://img.shields.io/badge/Powered_by-Vite-646CFF?style=for-the-badge)](https://vitejs.dev/)

The ProfStatsUTD Frontend drives the Chrome extension, providing an intuitive interface for seamless access to aggregated grades and professor ratings.

- **Hot Module Reloading:** Streamline development with Vite's hot module reloading for a faster iteration cycle.

- **Chakra UI Integration:** Enhance the user interface with the flexibility and style of Chakra UI components.

- **Debouncing Mechanism:** Optimize performance by preventing frequent backend requests through debouncing.

- **Client-Side Validation:** Validate queries on the client side to reduce the likelihood of backend requests with invalid inputs.

**Note:** During development, the backend endpoint is specified in the `.env` file, while for emulating production, it is configured in the `.env.production` file. When the backend is run in Docker, it operates under a different domain. 

<p align="center">
  <img src="assets/extension-screenshot-2.jpg" alt="Screenshot" width="400">
</p>

## Installation and Local Development

This project uses the `concurrently` package to run the backend and frontend concurrently, look at the `package.json` file for more details. Also make sure you have Node.js, Python 3.7+, and Docker installed.

### Setting up ProfStatsUTD

1. **Clone the repository**
  ```bash
  git clone https://github.com/GiridharRNair/ProfStatsUTD
  ```

2. **Set up a Python Virtual Environment**
  - Using venv:
    ```bash
    python3 -m venv env && source env/bin/activate
    ```
    More information on venv can be found [here](https://docs.python.org/3/library/venv.html).

  - Using conda:
    ```bash
    conda create --name profstatsutd python=3.8 && conda activate profstatsutd
    ```
      More information on conda environments can be found [here](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html).

3. **Install Dependencies and Start the Development Server**
  ```bash
  npm run install-packages && npm run start
  ```

4. **Access the App**

  Navigate to `chrome://extensions/`, enable developer mode, and then load the extension from the `extension/dist` folder. Thanks to the [CRX Vite plugin](https://github.com/crxjs/chrome-extension-tools), the extension will automatically reload whenever modifications are made to the frontend code.

  Additionally, you can access the frontend in the browser by visiting `localhost:5173` and the backend at `http://127.0.0.1:8000/docs`.

5. **Emulate Production Environment**
   ```bash
   npm run preview
   ```

   This command builds the extension, runs the Docker file in the backend, and compiles the frontend into the `dist` folder. This process enables you to preview the application in an environment that closely simulates a production setting.

## Acknowledgments

- [UTD Grades](https://utdgrades.com/)
- [The Rate My Professor Python Package](https://github.com/Nobelz/RateMyProfessorAPI)
- [Chrome Extension Vite Plugin](https://github.com/crxjs/chrome-extension-tools)

## To-Do

- [ ] Add tests

