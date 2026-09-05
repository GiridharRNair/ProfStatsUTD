# Grade Importer

Use the importer to parse local UTD grade distribution files and upload them to Supabase.

Dry run without credentials:

```bash
npm run import-grades:dry-run
```

Install upload dependencies:

```bash
python3 -m pip install -r requirements.txt
```

Upload to Supabase:

```bash
export SUPABASE_URL="https://your-project-ref.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
npm run import-grades
```

The service role key is needed only for trusted importer/API environments. Do not expose it in the Chrome extension.
