## Setup

In order to run this software, the Sox application needs to be installed on
your environment. The mp3 converter may need to be installed separately on
some systems. See the [Pysox documentation](https://pypi.org/project/sox/) for
installation instructions.

1. Install pipenv: `pipx install pipenv`
2. Install the project dependencies: `pipenv sync`
3. Start a pipenv shell: `pipenv shell`
4. Install the fastapi server: `pip install "fastapi[standard]"`

## Development

To run the dev environment:

1. Start a pipenv shell: `pipenv shell` 
2. From the shell, run the server in dev mode: `fastapi dev src/main.py`

By default, the server runs on port `8000`.
