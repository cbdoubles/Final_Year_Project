
# Installation Guide

## Prerequisites and Installation Steps:

### Java Development Kit (JDK)
1. **Install OpenJDK:** Download and install OpenJDK from [Oracle's official site](https://www.oracle.com/java/technologies/downloads/#jdk22-windows).
2. **Set Up Environment Variables for OpenJDK:**
    - Install OpenJDK in the C Drive.
    - Copy the folder path of JDK from the installation location (e.g., `C:\Program Files\Java\jdk-17.0.2`).
    - Search for "Environment Variables" on your PC and open the System Properties page.
    - Under "System variables", click "New". Set `JAVA_HOME` as the variable name and paste the copied folder path as the variable value.
    - Edit the "Path" variable under "System variables", click "New", and add `%JAVA_HOME%\bin`.
    - To verify the installation, open Command Prompt and type `java --version`.

### Neo4J Setup
3. **Download and Configure Neo4J:**
    - Download the community version of Neo4J from [Neo4J Official Site](https://neo4j.com/deployment-center/).
    - Extract it directly into the `C:\` drive.
    - Set the NEO4J_HOME environment variable similar to JAVA_HOME, pointing the "Path" to the `/bin` folder of Neo4J.
    - To install as a Windows service, open Terminal and run: `neo4j windows-service install`.

### Python Setup
4. **Install Python:**
    - Download and install Python 3.12 from [Python Official Downloads](https://www.python.org/downloads/).
    - Clone the repository to create a "Querify" folder.
    - Inside the "Querify" folder, create a virtual environment: `python -m venv ../env`.
    - Activate the virtual environment:
        - Command Prompt: `call ..\env\Scripts\activate.bat`
        - Git Bash: `../env/Scripts/activate.bat`
    - Install required Python packages: `pip install -r requirements.txt`.

### Node.js and NPM Setup
5. **Install Node.js:**
    - Download and install Node.js 22.0 from [Node.js Official Site](https://nodejs.org/en).
    - Navigate to the frontend directory in the terminal.
    - Install the necessary packages: `npm install`.

### Final Steps
6. **Project Verification:**
    - Ensure all installations are correctly set up and verify the project runs correctly.
    - Celebrate your success with a test run: `It works!`.

# Project Setup and Launch Instructions

## Prerequisites:
- Ensure that the Neo4J server is installed on your system and the `NEO4J_HOME` environment variable is set to the installation path.
- Python and Django installed for backend setup.
- Node.js and npm installed for frontend setup.

## Steps:

### Set Up the Neo4J Server:
1. **Start the Neo4J Server:** Open PowerShell and run the following command to start the Neo4J server:
   ```
   & "$env:NEO4J_HOME\bin\neo4j-admin.bat" server console
   ```

### Prepare the Backend:
2. **Activate Virtual Environment:** Navigate to the project root directory and activate the virtual environment. You can create one if it doesn't exist using `python -m venv env` and then activate it with:
   ```
   .\env\Scripts\activate  # Windows
   source env/bin/activate # Unix/Mac
   ```
3. **Upload Required Files:** Ensure to upload necessary files with the script that requires three arguments: username, password for Neo4J, and the path to the file you wish to upload.
4. **Navigate to Backend Directory:** Change directory to the backend:
   ```
   cd backend
   ```
5. **Database Migrations:** Prepare and apply database migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```
6. **Start Django Server:** Run the Django server:
   ```
   python manage.py runserver
   ```

### Set Up the Frontend:
7. **Open a New Terminal:** Ensure the Django server is still running in the first terminal.
8. **Navigate to Frontend Directory:** Change directory to the frontend folder:
   ```
   cd frontend
   ```
9. **Build the Frontend:** Compile the frontend assets:
   ```
   npm run build
   ```
10. **Launch Frontend Development Server:** Start the development server:
    ```
    npm run dev
    ```

### Final Step:
11. **Verification and Testing:** Ensure everything is working as expected and make adjustments if necessary. Sometimes, things don't go as planned:
    ```
    # Reflect on your efforts and the mysteries of software development
    pray
    ```

# Remarks:
I created a downloads folder inside api with custom input files I tried to abstract,
from their structure, but the main testing has been done on a json input,
as that was the easiest one for me for this attempt, the csv requires dealing,
with several files and combining them and I am not certain for graphml and sql,
make sure you have your username and password in views.py and neo4j_services.py
haven't tested it without that change

It will break if you use versions different than:
Python 3.12
Node 22.0
