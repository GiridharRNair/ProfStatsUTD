# ProfStatsUTD Backend

This repository contains the Python backend code for ProfStatsUTD, a Chrome extension built on the FastAPI framework. ProfStatsUTD provides aggregated grades and professor ratings for courses at The University of Texas at Dallas (UTD).

## Files

- **main.py**: FastAPI application handling professor information retrieval.
- **professor.py**: Module for Professor class, adapted from RateMyProfessorAPI.

## Database

The backend relies on the SQLite database (`utdgrades.sqlite3`) from the [utd-grades](https://github.com/acmutd/utd-grades) GitHub repository. To retrieve the database, clone the repository, navigate to it, and run:

```bash
npm install   # Install dependencies
npm run dev   # Create SQLite database and launch Next.js development server
```

The SQLite database will be generated in the `db` directory.

## Endpoints

### 1. `/professor_info`

- **Method:** `GET`
- **Parameters:**
  - `teacher` (required): Professor's name (e.g., Jey Veerasamy).
  - `course` (optional): Course in the format "CS1337" or "CS 1337".

#### Example

```bash
curl -X 'GET' \
  'http://127.0.0.1:8000/professor_info?teacher=jey&course=CS%201337' \
  -H 'accept: application/json'
```

Response:

```json
{
  "id": 1490925,
  "name": "Jeyakesavan Veerasamy",
  "department": "Computer Science",
  "grades": {
    "aPlus": 42,
    "a": 36,
    "aMinus": 35,
    "bPlus": 18,
    "b": 24,
    "bMinus": 18,
    "cPlus": 24,
    "c": 25,
    "cMinus": 2,
    "dPlus": 2,
    "d": 6,
    "dMinus": 4,
    "f": 15,
    "cr": 8,
    "nc": 7,
    "w": 12
  },
  "subject": "CS",
  "course_number": "1337",
  "rating": 3.3,
  "difficulty": 3.8,
  "would_take_again": 76,
  "tags": [
    "Accessible Outside Class",
    "Caring",
    "Lots Of Homework",
    "Skip Class? You Won't Pass.",
    "Lecture Heavy"
  ]
}
```

## Deployment

The backend uses a CI/CD pipeline configured in [main_profstatsutd.yml](../.github/workflows/main_profstatsutd.yml). This file builds the Docker image, pushes it to Azure Container Registry, and deploys it to Azure Web App.