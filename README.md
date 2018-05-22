# itineraryBuilder
## What does this application do? What is made for?

This application serves as a proof of concept for an itinerary builder whose goal is to assist the MyBhutan team during the sales process. With a product catalog containing more than 250 products, build a fully personnalized trip can be complicated. That's why we decided to build this application. It should allow our reader to manage the customer and product database; create a route planner for each customer; and save each route in a dedicated database. In order to facilitate interactions between MyBhutan and the authorities in Bhutan, we have also worked on a “financial reporting” functionality (i.e. a feature that summarize information for a given trip into a pdf that is then uploaded on the cloud).

Feel free to reach out to Nicolas Tachet for further information: nicolas.tachet@columbia.edu

## How can I initialize the project ?

This project has been built using Nodejs for the controller, Postgresql to organize our database and html to create the views (bootstrap templates…). Make sure you have installed the latest versions of Nodejs and Postgresql before setting up the project.

1. Download all the dependencies (actually all the dependencies should already be included in the node_modules/ folder)

2. Create an **Amazon Web Service** account and find your credentials. To do so you will need to use IAM (Identity and Access Management). In the IAM Dashboard, create a user; then in the “security credentials” section of this user, click on “Create access key”. Copy paste these credentials within the config.json file of the project. You will also need to create a bucket to store the pdf generated using the application. In the current project, replace all occurrences of "mybhutan-bucket1” by the name given to your bucket (in routes/itinerary.js and routes/report.js)

3. Install **pgadmin4** to manage easily your database using Postgresql. Then, restore the database using mybhutanPOC_backup (A plain text backup of the SQL database included in the project). Note that all the information contained in this database is dummy data we used to have something to work with. The client mentioned do not exist and the prices/costs associated to activities are randomly generated numbers. Using Pgadmin4 or any SQL command line, you can use this file to restore the database we used (https://www.pgadmin.org/docs/pgadmin4/1.x/backup_dialog.html). If you don’t do it, make sure you’re using the same schema for your table as the one we used. Afterwards, add your credentials in db.js (line 9) following the template below:

`var connectionString = postgresq://user:password@host:port/database`


## Overview of the code:

- **Public/** we stock images for our application as well as the bootstrap templates used for our html views

- **Routes/** a folder divided into 4 JavaScript (activities, customers, itineraries and reports). In each file, we perform the basic routing for each functionality using the express.js middleware (see https://expressjs.com/en/guide/routing.html).  Our reader will pay attention to the itinerary.js file in which we handle the itinerary creation (similar to the handling of a to-do list) and perform the upload of the report in AWS S3.

- **Views/** the folder containing all the views of our application. We organized this folder into 4 other folders (activity, customer, itinerary and report) that are all associated with a different route (see folder routes/)

- **app.js**: the front door of our application where we define the different routes, launch the local server and define the middleware used to set up the views (we used Nunjucks, see https://mozilla.github.io/nunjucks/
)

- **db.js**: the JavaScript file containing all the function to manage/access the database. Our application is based on CRUD operations meaning it is based mainly on the following operations: Create, Read, Update and Delete (although we add other functions that allows to find by additional pre-defined criteria). Our reader can refer to the following website to understand the basic of CRUD applications: https://stackify.com/what-are-crud-operations/

- **Config.json**: Insert your AWS S3 credentials here.

- **mybhutanPOC_backup**: a plain text backup of the SQL database. Note that all the information contained in this database is dummy data we used to have something to work with. The client mentioned do not exist and the prices/costs associated to activities are randomly generated numbers. Using Pgadmin4 or any SQL command line, you can use this file to restore the database we used (https://www.pgadmin.org/docs/pgadmin4/1.x/backup_dialog.html). If you don’t do it, make sure you’re using the same schema for your table as the one we used.

## Going further?


