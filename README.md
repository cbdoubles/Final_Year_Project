## Installation
Installation steps are as follows:
1. Install openjdk from [openjdk](https://www.oracle.com/java/technologies/downloads/#jdk22-windows). <br>
  1a. You have to put openjdk in your enviroment variables for it to communicate with your terminal. To do that, Install OpenJDK in the C Drive <br>
  1b. Copy the folder path of jdk from where you installed it (ex - C:\Program Files\Java\jdk-17.0.2) <br>
  1c. Search Enviroment Variables on your PC - which should open a system properties page, under that select Environment Variables. <br>
  1d. Click "New" under System variables, then under variable name: call it JAVA_HOME and under variable path: paste the copied folder path of your JDK. Once done click Ok. <br>
  1e. Click on the "Path" Variable under System variables, then click on "New" and then create an entry with the name "%JAVA_HOME%". Once done click Ok. Then the enviroment variable should be set for your Java. <br>
  1f. To test if its working - open cmd and type >java --version. <br>
2. Download and extract the community version of neo4j from [neo4j](https://neo4j.com/deployment-center/). Put the folder in the C:\ drive directly (not in any folder, DIRECTLY!). <br>
  2a. Set up the environment variable like for openjdk, make sure you point Path to the /bin folder, not the parent neo4j folder. <br>
3. Download python 3.12 from [Python 3.12](https://www.python.org/downloads/)
4. Clone the repository. This should create a "Querify" repository (i.e. folder). <br>
   4a. Open the terminal inside of the "Querify" folder. <br>
   4b. Run the command `python -m venv ../env` (please do not change anything from this command!). This command will create an env folder, which is your virtual environment. <br>
   4c. Activate the virtual environment by running the command  `call ..\env\Scripts\activate.bat` (for Command Prompt) or `../env/Scripts/activate.bat` (for Git Bath) inside the same terminal window. This will activate your vertual enviornment. <br>
   4d. Run the command `pip install -r requirements.txt` . This should download python along with the libraries needed to work on this project. <br>
5. Set up a virtual environment and open it up (python -m venv env) to set up and (.\env\Scripts\activate.bat)Clone the repository and navigate to it, run (pip install -r requirements.txt)
6. Install node.js 22.0 from [Node.js](https://nodejs.org/en)
7. Navigate to the frontend folder in the terminal and install the packages using (npm install)
8. It works!

## Usage
You need to run neo4j server before running the code itself.

1) You need to run neo4j server before running the code itself. (powershell command & "$env:NEO4J_HOME\bin\neo4j-admin.bat" server console)
2) activate the virtual environment and enter the root of the project
3) upload file (three arguments are required username for neo4j password for neo4j and path to file that you wish to upload)
4) cd backend
5) python manage.py makemigrations
6) python manage.py migrate
7) python manage.py runserver
8) create a new terminal while leaving the django server to run in the first one
9) cd frontend
10) npm run build
11) npm run dev
12) pray

## Remarks:
I created a downloads folder inside api with custom input files I tried to abstract,
from their structure, but the main testing has been done on a json input,
as that was the easiest one for me for this attempt, the csv requires dealing,
with several files and combining them and I am not certain for graphml and sql,
make sure you have your username and password in views.py and neo4j_services.py
haven't tested it without that change

It will break if you use versions different than:
Python 3.12
Node 22.0
