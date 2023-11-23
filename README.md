# ProfStatsUTD

This Chrome extension provides a quick and easy way to view professor ratings and grade distributions from UT Dallas's ProfStatsUTD backend.

<img src="extension/public/ExtensionPreview.gif" alt="Screenshot">

## [Backend](/server/)

The ProfStatsUTD Backend supports the Chrome extension by offering aggregated grades and professor ratings for UTD courses. Using an SQLite database from [utd-grades](https://github.com/acmutd/utd-grades), the setup involves cloning the repository, running commands, and starting the server. Key endpoints include `/grades` for grade data and `/ratings` for professor ratings, both requiring teacher names and optional course details. Deployment is simplified through a CI/CD pipeline in [main_profstatsutd.yml](../.github/workflows/main_profstatsutd.yml), handling Docker image creation, Azure Container Registry upload, and Azure Web App deployment.

## [Frontend](/extension/)

The ProfStatsUTD Frontend is the codebase for a Chrome extension that offers aggregated grades and professor ratings for UTD courses. The extension utilizes Chakra UI and Vite, providing a user-friendly interface to access this information effortlessly.

## Acknowledgments

This project was made possible by the following:

* [UTD Grades](https://utdgrades.com/)
* [The Rate My Professor Python Package](https://github.com/Nobelz/RateMyProfessorAPI)

## License

This project is licensed under the MIT License.
