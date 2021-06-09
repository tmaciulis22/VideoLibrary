# Setup
## Frontend and husky setup:
1. Run `yarn` at root directory
2. Run `yarn` at frontend directory
3. Run `yarn start` at frontend to launch

## Backend setup

First way:
1. You must have SQLEXPRESS installed.
2. Make sure that your SQLEXPRESS connection string matches the one in appsettings.json.
3. Start the backend project.

Second way:
1. Have docker-compose installed
2. Run `sudo docker-compose up` to launch both DB and backend at the same time (ignore the errors)
3. The backend will be running at http://localhost:44344

Third way:
1. Have docker-compose installed
2. Change the connection string in appsettings.json to `Server=.,1433;Database=WeDontByte;User=sa;Password=Password@123;`
3. Run `sudo docker-compose up db` to launch the DB
4. After DB is setup, start the backend project
