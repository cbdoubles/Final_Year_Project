name: Super-Lint

on:  
  push: 
  pull_request: 

permissions: {}

jobs:
  build:
    name: Lint
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: read
      statuses: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Super-linter
        uses: super-linter/super-linter@v6.5.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VALIDATE_ALL_CODEBASE: true
          REPORT_ERRORS: true
          FILTER_REGEX_EXCLUDE: (backend/api/apps.py|backend/api/models.py|backend/api/tests.py|backend/manage.py|backend/api/admin.py)
