# Grade Importer

Use the importer to parse local UTD grade distribution files and upload them to Supabase.

Dry run without credentials:

```bash
npm run import-grades:dry-run
```

Install upload dependencies:

```bash
python3 -m pip install -r requirements-dev.txt
```

Upload to Supabase:

Make sure these environment variables are set:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your-secret-key
```

Then run:

```bash
npm run import-grades
```

The secret key is needed only for trusted importer/API environments. Do not expose it in the Chrome extension.
