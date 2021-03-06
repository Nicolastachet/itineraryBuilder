# Itinerary Builder - Proof Of Concept
## About this application

This application serves as a proof of concept for an itinerary builder whose goal is to assist our client team throughout sales process. With a product catalog containing hundreds of products, build a fully personnalized trip can be complicated for our client. That's why we decided to build this application. It should allow our client to manage the customer and product database; create an itinerary for each customer; and save each itinerary in a dedicated database. 

In order to facilitate interactions between our client and other third parties, we have also implemented a “financial reporting” functionality (i.e. a feature that summarize information for a given trip into a pdf that is then uploaded on AWS S3).

Feel free to reach out to Nicolas Tachet for further information: nicolas.tachet@columbia.edu

## Setup

This project has been built using Nodejs for the controller, Postgresql to organize our database and html to create the views (bootstrap templates…). Make sure you have installed the latest versions of Nodejs and Postgresql before setting up the project.

1. Download all the dependencies (all the dependencies should already be included in the node_modules/ folder)

2. Create an **Amazon Web Service** account and find your credentials. To do so you will need to use IAM (Identity and Access Management). In the IAM Dashboard, create a user; then in the “security credentials” section of this user, click on “Create access key”. Copy paste these credentials within the config.json file of the project. You will also need to create a bucket to store the pdf generated using the application. In the current project, replace all occurrences of "mybhutan-bucket1” by the name given to your bucket (in routes/itinerary.js and routes/report.js)

![alt text](https://github.com/Nicolastachet/itineraryBuilder/blob/master/imagesForReadme/aws.png)


3. Install **pgadmin4** to manage easily your database using Postgresql. Then, create the database copying the schema suggested in the file DatabaseSchema. Make sure you’re using the same schema for your table as the one we used. 
![alt text](https://github.com/Nicolastachet/itineraryBuilder/blob/master/imagesForReadme/pg.png)

Afterwards, add your credentials in db.js (line 9) and app.js following the template below: `var connectionString = postgresq://user:password@host:port/database`


## Structure of the project:

- **Public/** we stock images for our application as well as the bootstrap templates used for our html views

- **Routes/** a folder divided into 4 JavaScript (activities, customers, itineraries and reports). In each file, we perform the basic routing for each functionality using the express.js middleware (see https://expressjs.com/en/guide/routing.html).  Our reader will pay attention to the itinerary.js file in which we handle the itinerary creation (similar to the handling of a to-do list) and perform the upload of the report in AWS S3.

- **Views/** the folder containing all the views of our application. We organized this folder into 4 other folders (activity, customer, itinerary and report) that are all associated with a different route (see folder routes/)

- **app.js**: the front door of our application where we define the different routes, launch the local server and define the middleware used to set up the views (we used Nunjucks, see https://mozilla.github.io/nunjucks/
)

- **db.js**: the JavaScript file containing all the function to manage/access the database. Our application is based on CRUD operations meaning it is based mainly on the following operations: Create, Read, Update and Delete (although we add other functions that allows to find by additional pre-defined criteria). Our reader can refer to the following website to understand the basic of CRUD applications: https://stackify.com/what-are-crud-operations/

- **Config.json**: Insert your AWS S3 credentials here.

- **DatabaseSchema**: A text file containing the schema of the 4 tables.

## Going further?

This application is only a proof of concept and could not be deployed as it is: some bugs can still be found. Not to mention those few bugs, some features should definitely be added:
- [ ] Connect the database with the CRM used by our client (i.e. make sure the application and the CRM share the same client/product information). A solution may be to use Zapier to automate this task as it allows to create "Zap" between Base CRM and a Postgresql database. This would facilitate the coding part and insure all the databases share the same information
- [ ] Improve the interface for retrieving and managing clients/products/reports (e.g. add a filter functionality)
- [ ] Allow the generation of financial reports over a period of time (not only for one client)
- [ ] E-Mail automatically those reports to appropriate third parties
- [ ] Add an authentication feature (session management) to make sure data can be accessed only by the right person 


