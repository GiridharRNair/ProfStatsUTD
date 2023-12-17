# ProfStatsUTD - Your Ultimate Course Registration Companion! 🌟

<p align="center">
  <img src="assets/marquee-promo-tile.jpg" alt="Screenshot" width="400">
</p>

[![Chrome Web Store](https://img.shields.io/badge/Featured_on-Chrome_Web_Store-cce7e8?style=for-the-badge)](https://chromewebstore.google.com/detail/profstats-ut-dallas/doilmgfedjlpepeaolcfpdmkehecdaff)

ProfStats is a handy Chrome extension that puts professor ratings and grade distributions together in one place, making it easy for students to get important info during course registration.

## Built With

[![Golang](https://img.shields.io/badge/Powered_by-Golang-00ADD8?style=for-the-badge&logo=go)](https://golang.org/)

[![Azure](https://img.shields.io/badge/Hosted_on-Azure-0089D6?style=for-the-badge&logo=microsoft-azure)](https://azure.microsoft.com/en-us/)

[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/index.html)

[![Docker](https://img.shields.io/badge/Containerized_with-Docker-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

[![Static Badge](https://img.shields.io/badge/CI/CD_with-GitHub_Actions-2088FF?style=for-the-badge)](https://github.com/features/actions)

[![Static Badge](https://img.shields.io/badge/Powered_by-Chakra_UI-319795?style=for-the-badge)](https://chakra-ui.com/)

[![Static Badge](https://img.shields.io/badge/Powered_by-Vite-646CFF?style=for-the-badge)](https://vitejs.dev/)

## Changelog:

**Version 1.0.3:**
- Added autocomplete for search queries.
- Migrated the backend to Golang for improved performance.

**Version 1.0.2:**
- Improved UI for a more user-friendly experience.
- Fixed minor bugs.

**Version 1.0.1:**
- Introduced dark mode and enhanced UI.
- Added access to professors' UTDgrades and UTD employee profiles.
- Included popular professor tags from Rate My Professor.
- Enhanced 404 error handling for smoother navigation.
- Added Info icon for feature requests, bug reports, and toggling dark/light mode.

**Version 1.0.0:**
- 🚀 Launched ProfStats: Your Ultimate Course Registration Companion!

## Local Installation

> [!NOTE]  
> This project leverages concurrent execution for both the server and extension, utilizing the beta version of the Vite CRX plugin to seamlessly incorporate hot reloading. This eliminates the need for manual rebuilding during development. Check out the `package.json` file for more details.

Make sure you have the following software installed on your machine:

- Docker
- Node.js
- Golang
- Python

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

## Deployment

Backend deployment is automated using Docker and Azure Web App, managed through a concise CI/CD pipeline with GitHub Actions. Commits trigger seamless updates, handling Docker image creation, Azure Container Registry push, and deployment to Azure Web App with ease. No manual steps required.

The frontend deployment is a manual process, I need to zip the `dist` folder and upload it to the Chrome Web Store to publish a new version. The review process takes about 2-3 days, depending on the permissions requested in the manifest.

## Acknowledgements

 - [UTD Grades](https://github.com/acmutd/utd-grades)
 - [CRX JS Vite Plugin](https://crxjs.dev/vite-plugin)

## License

[MIT](https://choosealicense.com/licenses/mit/)

 ## Contributors

<a href="https://github.com/GiridharRNair/ProfStatsUTD/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=GiridharRNair/ProfStatsUTD" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

