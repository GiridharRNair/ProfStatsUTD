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

The ProfStatsUTD Backend, powered by FastAPI, serves as the backbone for the Chrome extension, providing consolidated UTD course grades and professor ratings. In a strategic decision, the backend houses more functionality to prevent dependencies solely on the frontend. This approach minimizes the need for frequent Chrome extension updates on the web store in case of issues, ensuring a more efficient and hassle-free maintenance process.

Utilizing an SQLite database from utd-grades, the backend exposes key endpoints (/grades and /ratings) for data retrieval, requiring teacher names and optional course details.

Backend deployment is automated through a CI/CD pipeline (main_profstatsutd.yml), streamlining Docker image creation, Azure Container Registry upload, and Azure Web App deployment. This ensures a smooth development-to-production workflow.

## [Frontend Overview](/extension/README.md)

[![Static Badge](https://img.shields.io/badge/Powered_by-Chakra_UI-319795?style=for-the-badge)](https://chakra-ui.com/)
[![Static Badge](https://img.shields.io/badge/Powered_by-Vite-646CFF?style=for-the-badge)](https://vitejs.dev/)

The ProfStatsUTD Frontend drives the Chrome extension, providing an intuitive interface for seamless access to aggregated grades and professor ratings. Developed with Chakra UI and Vite, this frontend not only ensures a visually appealing and user-friendly experience but also incorporates client-side validation. This implementation aims to minimize frequent API server requests, enhancing efficiency and user experience.

<p align="center">
  <img src="assets/extension-screenshot-2.jpg" alt="Screenshot" width="400">
</p>

## Installation and Local Development

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

**Note:** Ensure Node is installed, and Docker is required for backend (dockerized during build). Reach out for assistance if needed.

## Acknowledgments

- [UTD Grades](https://utdgrades.com/)
- [The Rate My Professor Python Package](https://github.com/Nobelz/RateMyProfessorAPI)

## License

This project is licensed under the [MIT](LICENSE) License.
