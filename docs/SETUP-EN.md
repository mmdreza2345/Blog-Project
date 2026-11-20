# Run B-lock locally

Docker Compose starts the Next.js frontend, PHP 8.4 API and MySQL 8.4 together. Only the web service opens a port on your computer. You need an internet connection for the first build. After that you can start the existing containers and use the included articles offline.

## 1. Prepare your operating system

| System | Install and start Docker |
| --- | --- |
| Ubuntu 24.04 LTS or later | With Ubuntu's packages, run `sudo apt update`, then `sudo apt install docker.io docker-compose-v2` and `sudo systemctl enable --now docker`. If you already use Docker's own packages, keep that installation and its Compose plugin. |
| Other Linux distributions | Install Docker Engine and the Compose plugin for your distribution using the [Docker Engine guide](https://docs.docker.com/engine/install/). Start the Docker service. |
| Windows 10/11 | Install [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/), enable its WSL 2 backend and use Linux containers. Start Docker Desktop, then open PowerShell. |
| macOS (Apple silicon or Intel) | Install the matching [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/) and open it. Run the commands below in Terminal. |

Check that Docker is running:

```sh
docker version
docker compose version
```

The first command should show both Client and Server. On Linux, if your user cannot access the Docker socket, prefix the Docker commands in this guide with `sudo`. The containers supply Node.js, PHP and MySQL. The PHP API uses PDO and does not need Composer packages.

## 2. Open the project

Extract the ZIP, then open a terminal in the extracted folder containing `compose.yaml`. Alternatively, if you have Git and access to the GitHub repository, run:

```sh
git clone https://github.com/mmdreza2345/Blog-Project.git
cd Blog-Project
```

## 3. Start and check it

```sh
docker compose up --build -d
docker compose ps
```

The first start downloads images, builds the website and initializes MySQL. Wait until `db` is healthy and `api` and `web` are running, then open <http://localhost:3000>. Choose **Articles** to see the examples or **Sign up** to create a contributor. A saved draft appears in your dashboard. After you publish it, you can also read it in **Articles**.

The shipped articles use local images. A new article can use its category cover, a bundled path such as `/images/react.png`, or an HTTPS image URL. External images require a connection to their host.

## Everyday commands

| Task | Command |
| --- | --- |
| Stop services and keep articles, accounts and messages | `docker compose down` |
| Start again | `docker compose up -d` |
| Apply changes to PHP or frontend source | `docker compose up --build -d` |
| Inspect recent service logs | `docker compose logs --tail=60 web api db` |

MySQL stores application data in the named volume `blog_data`. Each collaborator has a separate local volume. Seed SQL runs only when MySQL first initializes an empty volume. Rebuilding the application keeps saved records. Removing the database volume deletes them. PHP sessions live in the API container, so recreating it can require another login.

## Read contact messages

After a successful submission, PHP saves the message in `contact_messages`. To open the local database as the application user:

```sh
docker compose exec db mysql -u blog -p block_blog
```

Enter the local sample database password `local-portfolio-db`, or the value you configured as `BLOG_DB_PASSWORD`. At the MySQL prompt:

```sql
SELECT created_at, name, email, subject, message
FROM contact_messages
ORDER BY id DESC;
```

Type `exit` to leave the MySQL prompt. Reading stored feedback requires database access. Email delivery is outside the scope of the local demo.

## If something does not start

- **Port 3000 is busy.** Create a file named `.env` beside `compose.yaml` containing `BLOG_PORT=3100`. Run `docker compose up -d` and open <http://localhost:3100>.
- **Cannot connect to Docker.** Start Docker Desktop or the Docker Engine service, then retry `docker version`.
- **The site reports a service error.** Check `docker compose ps` and `docker compose logs --tail=60 api db`. On first startup, wait for the database health check. The browser reaches PHP through the website at `/api`.
- **MySQL reports permission denied for the seed directory on Linux.** From the project root, run `chmod a+rx database` and `chmod a+r database/*.sql`, then start the services again. This directory contains the shipped schema and sample articles.
- **Use a different database password.** Set `BLOG_DB_PASSWORD` in the local `.env` before the first start. For an existing volume, changing that file alone does not update MySQL's stored password. Keep the current value or update the database user as part of the change.
- **No sample login.** Register a new account. The editorial seed author owns the example articles and has no password. Each author manages articles created under their own account.
