# Video Library
![gif-of-main-product-features](product-demo.gif)

# About
A Video Library web app developed using React and ASP.NET during Software Development course at Vilnius University for clients at Baltic Amadeus.  
This product lets video hobbyist convienently store and manage their videos.

## Documentation (in Lithuanian):
- `Technince-ataskaita.pdf` - Technical overview of this project (architecture, implementation of course technical requirements, etc.)
- `BA-dokumentacija.pdf` - Product vision, personas, examples of Jira tickets, Wireframes, etc. This documentation was required by clients at Baltic Amadeus.
- `TSPi-Ataskaita.pdf` - Overview of teamwork progress, product requirements, etc.

## Collaborators:
- Tautvydas Mačiulis - Product Owner, UI/UX, front-end development
- Julius Rasimas - Scrum Master, front-end and back-end development
- Aurimas Arlauskas - front-end and back-end development
- Simonas Vingis - back-end development
- Povilas Stašys - back-end development

# Setup
## Frontend setup:
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
