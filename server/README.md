# ProfStatsUTD Backend

This repository contains the backend code written in Python using the FastAPI framework for ProfStatsUTD, a Chrome extension designed to provide aggregated grades and professor ratings for courses at The University of Texas at Dallas (UTD).

## Database

The SQLite database used in this project is retrieved from the [utd-grades](https://github.com/acmutd/utd-grades) GitHub repository. To set up the database, clone and navigate to their repository and run the following commands:

```bash
npm install   # Install dependencies
npm run dev   # Create the SQLite database from raw data and launch the Next.js development server
```

The SQLite database will be created in the `db` directory. 

## Setup

To set up the ProfStatsUTD Backend on your local machine, follow these steps:

1. Ensure you have a virtual enviroment set up with Python 3.8+.
2. Clone the repository: `git clone https://github.com/GiridharRNair/ProfStatsUTD`
3. Change into the working directory: `cd server`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the backend: `uvicorn main:app --reload`

**Note:** Alternatively, this will also simultaneously start the React frontend and the FastAPI backend:

```bash
npm run start
```

This command utilizes `concurrently` to run the React development server and the FastAPI backend concurrently.
## Endpoints

### 1. `/grades`

- **Method:** `GET`
- **Parameters:**
  - `teacher` (required): The name of the professor (Example: Jey Veerasamy).
  - `course` (optional): The course in the format "CS1337" or "CS 1337".

#### Example

```bash
curl -X GET "http://127.0.0.1:5000/grades?teacher=Jey%20Veerasamy&course=CS1337"
```

### 2. `/ratings`

- **Method:** `GET`
- **Parameters:**
  - `teacher` (required): The name of the professor (Example: Jey Veerasamy).
  - `course` (optional): The course in the format "CS1337" or "CS 1337".

#### Example

```bash
curl -X GET "http://127.0.0.1:5000/ratings?teacher=Jey%20Veerasamy&course=CS1337"
```

## Deployment

The ProfStatsUTD backend utilizes a CI/CD pipeline configured in the YAML file [main_profstatsutd.yml](../.github/workflows/main_profstatsutd.yml). This file outlines the necessary steps for building the Docker image, pushing it to the Azure Container Registry, and deploying it to the Azure Web App.

