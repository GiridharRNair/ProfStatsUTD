# ProfStatsUTD Frontend

This is the frontend code for ProfStatsUTD, a Chrome extension that provides aggregated grades and professor ratings for courses at The University of Texas at Dallas (UTD), built using Chakra UI and Vite.

## Environment Variables
To run the YourDailyRundown Frontend, you'll need to set the following environment variables:

`VITE_API_URL` = Backend Domain (ex. http://127.0.0.1:5000) <br/>

## Installation and Setup
1. Clone the repository: `git clone https://github.com/GiridharRNair/ProfStatsUTD`
2. Change into the working directory: `cd extension`
3. Install the required dependencies using `npm install`.
5. Start the development server with `npm run dev`.
6. Access the app in your browser at `http://localhost:5173/`.

## Testing the App
You can test the app by enabling developer mode in your Chrome browser and unpacking the `dist` folder after running `npm run build`. Follow these steps:

1. Build the app with `npm run build` to generate the `dist` folder.
2. Open your Chrome browser.
3. Navigate to `chrome://extensions/`.
4. Enable "Developer mode" using the toggle switch.
5. Click on "Load unpacked" and select the `dist` folder within the `extension` directory in your cloned repository.
6. The ProfStatsUTD Chrome extension will be loaded.

