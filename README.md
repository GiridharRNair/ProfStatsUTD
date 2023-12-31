<h1 align="center">ProfStatsUTD</h1>

<p align="center">
  <img src="assets/extension-screenshot-1.jpg" alt="Screenshot" width="400">
</p>

[![Chrome Web Store](https://img.shields.io/badge/Featured_on-Chrome_Web_Store-cce7e8?style=for-the-badge)](https://chromewebstore.google.com/detail/profstats-ut-dallas/doilmgfedjlpepeaolcfpdmkehecdaff)

ProfStats is a handy Chrome extension that puts professor ratings and grade distributions together in one place, making it easy for students to get important info during course registration.

## Built With

[![Gin Gonic](https://img.shields.io/badge/Powered_by-Gin_Gonic-00ADD8?style=for-the-badge&logo=go)](https://gin-gonic.com/)

[![Python](https://img.shields.io/badge/Powered_by-Python-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)

[![Vite](https://img.shields.io/badge/Powered_by-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

[![React](https://img.shields.io/badge/Powered_by-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

[![Azure](https://img.shields.io/badge/Hosted_on-Azure-0089D6?style=for-the-badge&logo=microsoft-azure)](https://azure.microsoft.com/en-us/)

[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/index.html)

[![Docker](https://img.shields.io/badge/Containerized_with-Docker-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)


## Frontend Overview

Built with Vite, React, and Chakra UI for a streamlined interface. Optimizes backend performance through debouncing, ensures data accuracy with client-side validation, and utilizes [CRXJS](https://crxjs.dev/vite-plugin/) for Chrome extension hot module reloading (HMR) during development.

### Updating Version

Simply update the version in `package.json`. Starting the server in development or production will automatically reflect the updated version in the manifest file. Reload or remove and re-add the extension to see the changes.

### Deployment

GitHub Actions automate staging on the Chrome Web Store using [Chrome-Webstore-Upload-Action](https://github.com/fregante/chrome-webstore-upload). While manual submission for review is required, the tedious uploading process is fully automated.

## Backend Overview

Built with Golang and Gin Gonic, the backend utilizes an SQLite database generated by a Python script in `db_setup`, sourcing data from `raw_data`. The system fetches ratings from the Rate My Professor GraphQL API and queries the aggregated grade distribution from the SQLite database for all courses or a specific course.

### Endpoints

1. **Get Professor Information**

   - **Endpoint:** `/professor_info`
   - **Method:** GET
   - **Query Parameters:**
     - `teacher` (required): Name of the professor.
     - `course` (optional): Course subject and number (e.g., CS 1337).
   - **Response:**
     - Detailed information about the specified professor, including ratings, department, and grade distribution for all courses or a specific course.

2. **Get Course Information**

   - **Endpoint:** `/course_info`
   - **Method:** GET
   - **Query Parameters:**
     - `course` (required): Course subject and number (e.g., CS 1337).
   - **Response:**
     - Returns the name and grade distribution of the specified course.

3. **Search Query Suggestions**

   - **Endpoint:** `/suggestions`
   - **Method:** GET
   - **Query Parameters:**
     - `teacher` (optional): Name of the professor.
     - `course` (optional): Course subject and number (e.g., CS 1337).
   - **Response:**
     - Returns a list of distinct professor and course names similar to the specified query.

### CORS Configuration

The API allows requests from the following origins:

- `http://localhost:5173`
- `chrome-extension://doilmgfedjlpepeaolcfpdmkehecdaff`

### Deployment

Dockerized and deployed on Azure Web App Service using GitHub Actions for CI/CD.

## Local Development

> [!NOTE]  
> This project uses concurrently to run the server and extension concurrently. Check out the `package.json` file for more details.

Make sure you have the following software installed on your machine:

-   Node.js
-   Golang
-   Python

### Steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/GiridharRNair/ProfStatsUTD
    ```

2. **Navigate to the project directory:**

    ```bash
    cd ProfStatsUTD
    ```

3. **Install dependencies:**

    ```bash
    npm install-packages
    ```

4. **Start the server and extension concurrently:**

    ```bash
    npm run dev
    ```

5. **Enable Developer Mode in Chrome:**

    - Navigate to `chrome://extensions/`.
    - Enable Developer Mode.

6. **Load the extension:**

    - Unpack the `dist` folder.
    - Start using the extension for seamless testing and development.

Please feel free to open an issue or submit a pull request if you have any suggestions or feedback.