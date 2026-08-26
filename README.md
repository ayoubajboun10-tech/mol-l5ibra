# MOL L5IBRA

Football • Wisdom • Stories

## Files
- `index.html` — main website
- `admin.html` — admin starter page
- `style.css` — design
- `script.js` — website logic + Supabase read
- `config.js` — Supabase public configuration
- `supabase.sql` — database table + starter data

## GitHub Pages + Supabase
1. Create a Supabase project.
2. Open SQL Editor and run `supabase.sql`.
3. In Supabase Project Settings → API, copy the Project URL and publishable/anon key.
4. Put them in `config.js`.
5. Upload all files to GitHub.
6. Enable GitHub Pages.

Never put a Supabase `service_role`/secret key in GitHub.

The next step can be a full Supabase Auth admin login with protected insert/update/delete operations.
