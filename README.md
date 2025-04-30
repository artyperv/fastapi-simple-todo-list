# Simple FastAPI Todo List

A modern todo list application built with FastAPI backend and a modern frontend framework.

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Redis
- Nginx
- Poetry (Python package manager)

## Project Structure

```
.
├── backend/          # FastAPI backend
├── frontend/         # Frontend application
└── venv/            # Python virtual environment
```

## Backend Setup

1. Install Poetry if you haven't already:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Install backend dependencies:
```bash
cd backend
poetry install
```

3. Configure the application:
Create a `config.yaml` file in the backend directory based on `config.yaml.temp`.

4. Run database migrations:
Create a `app/models/alembic.ini` file in the backend directory based on `app/models/alembic.ini.tmp`.
```bash
alembic -c app/models/alembic.ini upgrade head
```

5. Start the backend server:
```bash
start
```

## Frontend Setup

1. Install frontend dependencies:
```bash
cd frontend
pnpm i
```

2. Start the frontend development server:
```bash
pnpm run dev
```

## Database Setup

1. Start PostgreSQL:
```bash
# On macOS using Homebrew
brew services start postgresql

# On Linux
sudo service postgresql start
```

2. Create the database:
```bash
createdb tododb
```

3. Start Redis:
```bash
# On macOS using Homebrew
brew services start redis

# On Linux
sudo service redis-server start
```

## Nginx Configuration

1. Install Nginx:
```bash
# On macOS using Homebrew
brew install nginx

# On Linux
sudo apt-get install nginx
```

2. Create a new configuration file in `/usr/local/etc/nginx/servers/` (macOS) or `/etc/nginx/sites-available/` (Linux):
```nginx
server {
    listen 80;
    server_name todo.local;

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    location /api/v1/todos/ws {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/v1 {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header   X-Forwarded-Host $server_name;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

3. Add the domain to your hosts file:
```bash
# On macOS/Linux
echo "127.0.0.1 todo.local" | sudo tee -a /etc/hosts
```

4. Restart Nginx:
```bash
# On macOS using Homebrew
brew services restart nginx

# On Linux
sudo service nginx restart
```

## Development

- Backend API will be available at: `http://localhost:8001`
- Frontend will be available at: `http://localhost:5173`
- Production-like environment will be available at: `http://todo.local`

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8001/api/v1/docs`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
