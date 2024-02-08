<h1 align="center">ProfStatsUTD</h1>

<p align="center">
  <img src="assets/marquee-promo-tile.jpg" alt="Screenshot" width="400">
</p>

[![Chrome Web Store](https://img.shields.io/badge/Featured_on-Chrome_Web_Store-cce7e8?style=for-the-badge)](https://chromewebstore.google.com/detail/profstats-ut-dallas/doilmgfedjlpepeaolcfpdmkehecdaff)

ProfStats is a handy Chrome extension with 100+ users, merging professor ratings and grade distributions at the University of Texas at Dallas for simplified access to course information for students.

## Built With

- [![Gin Gonic](https://img.shields.io/badge/Powered_by-Gin_Gonic-00ADD8?style=for-the-badge&logo=go)](https://gin-gonic.com/)
- [![Python](https://img.shields.io/badge/Powered_by-Python-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)
- [![Vite](https://img.shields.io/badge/Powered_by-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
- [![React](https://img.shields.io/badge/Powered_by-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
- [![Azure](https://img.shields.io/badge/Hosted_on-Azure-0089D6?style=for-the-badge&logo=microsoft-azure)](https://azure.microsoft.com/en-us/)
- [![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/index.html)
- [![Docker](https://img.shields.io/badge/Containerized_with-Docker-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

## Frontend Overview

Built with Vite, React, Chakra UI, and Chart.js the front end ensures a streamlined interface. Features include backend performance optimization through debouncing, client-side validation for data accuracy, and utilization of [CRXJS](https://crxjs.dev/vite-plugin/) for Chrome extension hot module reloading (HMR) during development.

### Updating Version

Simply update the version in `package.json`. Starting the server in development or production will automatically reflect the updated version in the manifest file. Might need to reload or re-add the extension to see the updated version.

### Deployment

GitHub Actions automates staging on the Chrome Web Store upon the release of a new version using [Chrome-Webstore-Upload-Action](https://github.com/fregante/chrome-webstore-upload). Although manual submission for review is necessary, the tedious uploading process is entirely automated.

### Env Variables
```
VITE_API_URL: URL of the production backend API
```

## Backend Overview

Utilizing Gin Gonic and Python, the backend fetches ratings from the Rate My Professor GraphQL API and queries aggregated grade distribution from the SQLite database. 

The database is dynamically generated by a Python script in `db_setup` whenever the development server is initiated, using only Python's standard library and the grade distributions in `raw_data`.

> [!NOTE]  
> The grade distributions in `raw_data` are from the [UTD Grades](https://github.com/acmutd/utd-grades/tree/master/raw_data) repository

### Endpoints

1. **Get Professor Information**

   - **Endpoint:** `/professor_info`
   - **Method:** GET
   - **Query Parameters:**
     - `teacher` (required): Name of the professor.
     - `course` (optional): Course subject and number (e.g., CS 1337).
   - **Response:**
     - Information about the specified professor, including ratings, department, and grade distribution for all courses or a specific course.

2. **Get Course Information**

   - **Endpoint:** `/course_info`
   - **Method:** GET
   - **Query Parameters:**
     - `course` (required): Course subject and number (e.g., CS 1337).
   - **Response:**
     - Name and grade distribution for the specified course.

3. **Search Query Suggestions**

   - **Endpoint:** `/suggestions`
   - **Method:** GET
   - **Query Parameters:**
     - `teacher` (optional): Name of the professor.
     - `course` (optional): Course subject and number (e.g., CS 1337).
   - **Response:**
     - List of distinct professors and course names similar to the specified query.

### CORS Configuration

The API allows requests only from the following origin:

- `chrome-extension://doilmgfedjlpepeaolcfpdmkehecdaff`

### Deployment

Dockerized and deployed on the Azure Web App Service after running the Python scripts to generate and test the SQLite database, using GitHub Actions for CI/CD.

### Testing

The Python scripts responsible for generating the SQLite database are tested using Python's unit test module, and the Go server is tested using Go's testing package. To run both tests, execute the following command:

```bash
npm run test-api
```

## Local Development

> [!NOTE]  
> This project uses the `concurrently` package to run the server and extension concurrently. Check out the `package.json` file for more details.

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
    npm run install-packages
    ```

4. **Start the server and extension concurrently:**

    ```bash
    npm run start
    ```

5. **Enable Developer Mode in Chrome:**

    - Navigate to `chrome://extensions/`.
    - Enable Developer Mode.

6. **Load the extension:**

    - Unpack the `dist` folder.
    - Start using the extension for seamless testing and development.

Please feel free to open an issue or submit a pull request if you have any suggestions or feedback.