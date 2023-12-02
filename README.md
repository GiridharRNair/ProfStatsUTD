<h1 align="center">ProfStatsUTD</h1>

<p align="center">
This extension offers a user-friendly interface for accessing aggregated grades and professor ratings effortlessly.

ProfStats is an extension that combines professor ratings from RateMyProfessor.com and grade distributions from UTDgrades.com into a single, convenient location. This allows students to easily and quickly access important information about their professors during the course registration season.
</p>

<p align="center">
  <img src="assets/extension-screenshot-1.jpg" alt="Screenshot" width="400">
</p>

[![Static Badge](https://img.shields.io/badge/Featured_on-Chrome_Web_Store-cce7e8?style=for-the-badge)](https://chromewebstore.google.com/detail/profstats-ut-dallas/doilmgfedjlpepeaolcfpdmkehecdaff)
[![Static Badge](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://raw.githubusercontent.com/GiridharRNair/ProfStatsUTD/main/LICENSE)

## [Backend Overview](/server/README.md)

[![Static Badge](https://img.shields.io/badge/Deployed_on-Azure-0089D6?style=for-the-badge)](https://profstatsutd.azurewebsites.net/docs)
[![Static Badge](https://img.shields.io/badge/Powered_by-FastAPI-009688?style=for-the-badge)](https://fastapi.tiangolo.com/)
[![Static Badge](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge)](https://www.sqlite.org/index.html)
[![Static Badge](https://img.shields.io/badge/Containerized_with-Docker-2496ED?style=for-the-badge)](https://www.docker.com/)
[![Static Badge](https://img.shields.io/badge/CI/CD_with-GitHub_Actions-2088FF?style=for-the-badge)](https://github.com/features/actions)

The ProfStatsUTD Backend, powered by FastAPI, serves as the foundation for the Chrome extension. It consolidates UTD course grades and professor ratings, minimizing dependencies on the frontend for more efficient maintenance. The backend utilizes an SQLite database from utd-grades, providing data retrieval through /professor_info, requiring teacher names and optional course details. Deployment is automated through a CI/CD pipeline, facilitating Docker image creation, Azure Container Registry upload, and Azure Web App deployment, ensuring a smooth development-to-production workflow.

## [Frontend Overview](/extension/README.md)

[![Static Badge](https://img.shields.io/badge/Powered_by-Chakra_UI-319795?style=for-the-badge)](https://chakra-ui.com/)
[![Static Badge](https://img.shields.io/badge/Powered_by-Vite-646CFF?style=for-the-badge)](https://vitejs.dev/)

The ProfStatsUTD Frontend drives the Chrome extension, providing an intuitive interface for seamless access to aggregated grades and professor ratings. Developed with Chakra UI and Vite, this frontend not only ensures a visually appealing and user-friendly experience but also incorporates client-side validation. This implementation aims to minimize frequent API server requests, enhancing efficiency and user experience.

<p align="center">
  <img src="assets/extension-screenshot-2.jpg" alt="Screenshot" width="400">
</p>

## Installation and Local Development

This project uses the `concurrently` package to run the backend and frontend concurrently, look at the `package.json` file for more details.

### Setting up ProfStatsUTD

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GiridharRNair/ProfStatsUTD
   ```

2. **Set up a Python Virtual Environment:**
   - Using venv:
     ```bash
     python3 -m venv env && source env/bin/activate
     ```
   - Using conda:
     ```bash
     conda create --name profstatsutd python=3.8 && conda activate profstatsutd
     ```

3. **Install Dependencies and Start the Development Server:**
   ```bash
   npm run install-packages && npm run start
   ```

4. **Access the App:**
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

5. **Test the Chrome Extension:**
   - Build the application:
     ```bash
     npm run build
     ```
   - Load the extension in Chrome from the `dist` folder.

**Note:** Ensure Node and Docker are installed. Reach out for assistance if needed.

## Acknowledgments

- [UTD Grades](https://utdgrades.com/)
- [The Rate My Professor Python Package](https://github.com/Nobelz/RateMyProfessorAPI)

## To-Do

- [ ] Add tests
- [ ] Add search query autocomplete

