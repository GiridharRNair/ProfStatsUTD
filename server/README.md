# ProfStatsUTD - Backend

ProfStatsUTD is a Python Flask backend for the ProfStatsUTD project, providing information about professors and course grades at The University of Texas at Dallas.

## Database

The SQLite database used in this project is retrieved from the [utd-grades](https://github.com/acmutd/utd-grades) GitHub repository. To set up the database, clone the repository and run the following commands:

```bash
npm install   # Install dependencies
npm run dev   # Create the SQLite database from raw data and launch the Next.js development server
```

The SQLite database will be created in the `db` directory. 

## Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/GiridharRNair/ProfStatsUTD.git
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask application:

   ```bash
   python main.py
   ```

   The application will run on `http://127.0.0.1:5000/` by default.

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

#### Example

```bash
curl -X GET "http://127.0.0.1:5000/ratings?teacher=Jey%20Veerasamy"
```

## Error Handling

The backend includes error handlers for common HTTP exceptions, rendering corresponding HTML templates for 401, 403, 404, and 408 status codes.

## Acknowledgment

We would like to thank the developers of the [RateMyProfessorAPI](https://github.com/Nobelz/RateMyProfessorAPI) Python package.
