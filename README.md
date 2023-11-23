<h1 align="center">ProfStatsUTD</h1>

<p align="center">
  ProfStatsUTD is a powerful Chrome extension designed to streamline the process of accessing valuable insights into professor ratings and course grade distributions at the University of Texas at Dallas (UTD).
</p>

<p align="center">
  <img src="assets/extension-screenshot-1.jpg" alt="Screenshot" width="400">
</p>

## [Backend](/server/)

The ProfStatsUTD Backend serves as the backbone for the Chrome extension, offering aggregated grades and professor ratings for UTD courses. Leveraging an SQLite database sourced from [utd-grades](https://github.com/acmutd/utd-grades), this backend provides key endpoints such as `/grades` for detailed grade data and `/ratings` for professor ratings, both of which require teacher names and optional course details for retrieval.

Deployment of the backend is simplified through a CI/CD pipeline, as defined in [main_profstatsutd.yml](/.github/workflows/main_profstatsutd.yml). This pipeline automates Docker image creation, Azure Container Registry upload, and Azure Web App deployment, ensuring a seamless development-to-production workflow.

### Getting Started - Backend Development Server

To kickstart the development server for the backend, follow these steps:

1. Clone the repository.
2. Navigate to the `/server/` directory.
3. Refer to the detailed instructions in the [Backend README](/server/README.md) to run the necessary commands and start the server.

## [Frontend](/extension/)

The ProfStatsUTD Frontend is the codebase for the accompanying Chrome extension. This frontend, built with Chakra UI and Vite, offers a visually appealing and user-friendly interface for accessing aggregated grades and professor ratings effortlessly.

<p align="center">
  <img src="assets/extension-screenshot-2.jpg" alt="Screenshot" width="400">
</p>

For more detailed instructions on setting up the frontend and integrating it with the backend, please refer to the [Frontend README](/extension/README.md).

## Acknowledgments

This project wouldn't have been possible without the invaluable contributions from:

- [UTD Grades](https://utdgrades.com/)
- [The Rate My Professor Python Package](https://github.com/Nobelz/RateMyProfessorAPI)

## License

This project is licensed under the [MIT](LICENSE) License.
