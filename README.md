## Setup

1. Install pipenv: `pipx install pipenv`
2. Install the project dependencies: `pipenv sync`
3. Start a pipenv shell: `pipenv shell`
4. Install the fastapi server: `pip install "fastapi[standard]"`

## Development

To run the dev environment:

1. Start a pipenv shell: `pipenv shell` 
2. From the shell, run the server in dev mode: `fastapi dev src/main.py`

By default, the server runs on port `8000`.
