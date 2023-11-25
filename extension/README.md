# ProfStatsUTD Frontend

This repository contains the frontend code for ProfStatsUTD, a Chrome extension designed to provide aggregated grades and professor ratings for courses at The University of Texas at Dallas (UTD). The frontend is built using Chakra UI and Vite.

<p align="center">
  <img src="../assets/extension-screenshot-2.jpg" alt="Screenshot" width="400">
</p>

## Installation and Setup

To set up the ProfStatsUTD Frontend on your local machine, follow these steps:

1. Clone the repository: `git clone https://github.com/GiridharRNair/ProfStatsUTD`
2. Change into the working directory: `cd extension`
3. Install the required dependencies using `npm install`.
4. Start the development server with `npm run dev`.
5. Access the app in your browser at `http://localhost:5173/`.

**Note:** Alternatively, this will also simultaneously start the React frontend and the FastAPI backend:

```bash
npm run start
```

## Testing the App

To test the ProfStatsUTD Chrome extension in your Chrome browser, enable developer mode and unpack the `dist` folder after running `npm run build`. Follow these steps:

1. Build the app with `npm run build` to generate the `dist` folder.
2. Open your Chrome browser.
3. Navigate to `chrome://extensions/`.
4. Enable "Developer mode" using the toggle switch.
5. Click on "Load unpacked" and select the `dist` folder within the `extension` directory in your cloned repository.
6. The ProfStatsUTD Chrome extension will be loaded and ready for use.

**Note:** Alternatively, this will also simultaneously build the React frontend and start the FastAPI backend:

```bash
npm run build
```


Feel free to explore and provide feedback on the functionality and user experience of the ProfStatsUTD Chrome extension.