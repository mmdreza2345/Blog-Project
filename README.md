# B-lock

B-lock is a collaborative developer-blog portfolio. Readers can browse articles by topic. Each contributor can create an account, save a draft, publish it and manage their own work. The original Next.js interface now uses a PHP API and a MySQL database.

## Run locally

Install Docker with Compose v2. From the folder containing `compose.yaml`, run:

```sh
docker compose up --build -d
```

Open <http://localhost:3000>. The first run creates the database and loads 15 example articles in six categories. Choose **Sign up** to create your own author account. Each clone has its own database. GitHub shares the source code.

- [English setup guide](docs/SETUP-EN.md)
- [راهنمای نصب و اجرای فارسی](docs/SETUP-FA.md)

## Try the author workflow

1. Sign up, log in, choose **Create post**, write an article and select **Save draft**.
2. Open it from **Dashboard → Edit**, change its status to **Published** and save. Find it in **Articles** or its category.
3. Change your byline under **Manage profile**. The new name appears on your existing articles. The same page lets you change your password.
4. Sign in with a second account to leave a comment. Its dashboard lists only its own articles.
5. Use **Contact** to leave feedback. The PHP service stores messages in MySQL. The setup guides show maintainers how to read them.

## Project layout

| Location | Purpose |
| --- | --- |
| `src/app`, `src/components` | Next.js pages, article editor, account forms and reading interface |
| `src/lib` | Browser API client, request errors and data loading |
| `backend/public/index.php` | PHP HTTP routes |
| `backend/lib` | PDO queries, validation, sessions and author operations |
| `database/01-schema.sql`, `02-demo.sql` | MySQL tables and editorial sample data |
| `compose.yaml` | Web, API and database services for local development |

The browser sends requests to `/api` on the web origin. Next.js forwards them to PHP. PHP hashes passwords, stores the session ID in an HttpOnly cookie, and checks article ownership for every author operation. Drafts are visible in the author's dashboard and published articles appear in the public reading views. The Contact form stores feedback locally.

## Working together

Create a branch for each change and open a pull request against this repository. Commit schema and seed changes under `database/`. Keep individual accounts, messages, local database volumes and credentials on your machine. The seed byline **B-lock Editors** has no login. The account from the earlier JSON demo is excluded.

Run the frontend checks with Node.js 22 and npm:

```sh
npm ci
npm run lint
npm run build
```

To stop the local app and keep its data, run `docker compose down`.
