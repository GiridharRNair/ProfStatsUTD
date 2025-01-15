<p align="center">
  <img src="assets/marquee-promo-tile.jpg" alt="Screenshot" width="400">
</p>

[![Chrome Web Store](https://img.shields.io/badge/Featured_on-Chrome_Web_Store-cce7e8?style=for-the-badge)](https://chromewebstore.google.com/detail/profstats-ut-dallas/doilmgfedjlpepeaolcfpdmkehecdaff)

ProfStats is a handy Chrome extension with 150+ users, merging professor ratings and grade distributions at the University of Texas at Dallas for simplified access to course information for students.

The frontend is built with React using Vite, while the backend is built with Golang and deployed on Azure Web App via Docker. The SQLite database is created and populated using a Python script, utilizing CSV files from the `raw_data` directory sourced from [UTD Grades](https://github.com/acmutd/utd-grades).

## Local Development

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
    npm run install
    ```

    > This command installs the dependencies for the Golang backend and the React frontend

4. **Start the server and extension concurrently:**

    ```bash
    npm run dev
    ```

    > This project uses the `concurrently` npm package to run the server and extension concurrently

5. **Enable Developer Mode in Chrome:**

    - Navigate to `chrome://extensions/`.
    - Enable Developer Mode.

6. **Load the extension:**

    - Unpack the `dist` folder.
    - Start using the extension for seamless testing and development.

Please feel free to open an issue or submit a pull request if you have any suggestions or feedback.
