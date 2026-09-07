<table>
  <tr>
    <td><img src="assets/extension-screenshot-1.png" alt="Look up professor info quickly" width="100%"></td>
    <td><img src="assets/extension-screenshot-2.png" alt="Click their name for quick links" width="100%"></td>
  </tr>
</table>

[![Chrome Web Store](https://img.shields.io/badge/Featured_on-Chrome_Web_Store-cce7e8?style=for-the-badge)](https://chromewebstore.google.com/detail/profstats-ut-dallas/doilmgfedjlpepeaolcfpdmkehecdaff)

ProfStats is a handy Chrome extension with 150+ users, merging professor ratings and grade distributions at the University of Texas at Dallas for simplified access to course information for students.

The extension is built with Plasmo, React, and TypeScript. The backend is a FastAPI app deployed as Vercel Python serverless functions, reading grade distributions from Supabase and fetching RateMyProfessors ratings live. Grade data comes from CSV files in the `raw_data` directory sourced from [UTD Grades](https://github.com/acmutd/utd-grades).

## Layout

```text
extension/    Plasmo + React + TypeScript Chrome extension
api/          FastAPI app deployed as Vercel Python serverless functions
scripts/      Python data import and maintenance scripts
supabase/     SQL schema files and indexes
raw_data/     Source grade distribution files
```

## Local Development

You will need Node.js 20.19+ and Python 3.12+.

### Backend

Install the Python dependencies and run the API:

```bash
python3 -m pip install -r requirements.txt
uvicorn app.main:app --reload --app-dir api
```

`/suggestions` and `/professor_info` need Supabase credentials. Copy `.env.example` to `.env` and fill in:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
```

`/health` works without them.

### Extension

```bash
cd extension
npm install
npm run dev
```

The extension reads its API base URL from `PLASMO_PUBLIC_API_URL` in the repo-root `.env`, falling back to `http://localhost:8000`.

Then load it in Chrome:

- Navigate to `chrome://extensions/`.
- Enable Developer Mode.
- Choose "Load unpacked" and select `extension/build/chrome-mv3-dev`.

Run `npm run build` in `extension/` for a production build in `extension/build/chrome-mv3-prod`.

### Checks

```bash
cd extension && npm run typecheck && npm run lint && npm run format:check
cd api && ruff check . && mypy
```

`mypy` and `ruff` read their configuration from `api/pyproject.toml`, whose
paths are relative to `api/`, so run them from that directory.

## Importing Grade Data

See [scripts/README.md](scripts/README.md).

## Deployment

The API deploys to Vercel from `main`. `SUPABASE_URL` and `SUPABASE_SECRET_KEY` must be set in the Vercel project. The extension is packaged with `npm run package` in `extension/` and uploaded to the Chrome Web Store.

Please feel free to open an issue or submit a pull request if you have any suggestions or feedback.
