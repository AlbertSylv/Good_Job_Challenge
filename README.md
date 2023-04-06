# Welcome to the good job challenge project!

This project is only the frontend. It needs a Directus backend, that you'll need to create manually.

but dont worry! Directus is pretty easy to set up.

# Directus setup (Backend)

These instructions assume that you have node installed and a clean database running

Start by opening a terminal and navigate to a folder where you want your backend project stored

Run the following commands:

    npm install -g directus

    npx create-directus-project directus_goodjobchallenge

Now you'll be prompted to choose your databse settings and create an admin user

Once you've created the project, navigate into it and run "npx directus start"

Your directus backend should now be running on "localhost:8055/admin"

Use the admin login you just created to login on directus

You'll now need to create two tables/collections.

Press the "Create Collection" button

Name of the collection should be "jobs"

Press the tick in the top right

Now you'll need to add a few fields to your collection, press "Create Field"

First field:

Kind of field: input field
Key: "description"
type:String
Required: yes

Second field:

Kind of field: input field
Key: "title"
type:String
Required: yes

Third field:

Kind of field: input field
Key: "points"
type: Integer
Required: yes

Save the jobs collection.

Go to settings -> Data Model in the side bar

Now you're gonna add the second and final collection by pressing the + in the top right corner

Name of the new collection should be "userjobs"

Under "Optional System Fields" you need to tick on date_created and user_created.

Press the tick in the top right corner

Now we need to create some fields for the userjobs collection:

First field:

Kind of field: many to one
Key: "jobId"
type: integer
Required: yes
Related Collection: jobs
Display Template: ID

Second field:

Kind of field: input field
Key: "user_name"
type:String
Required: yes

Third field:

Kind of field: input field
Key: "Points"
type: Integer
Required: yes

Fourth field:

Kind of field: input field
Key: "job_title"
type:String
Required: yes

Now you need to go to "Roles & Permissions" under settings.

Click on the Public user and give give it access to create directus users, everything else should not be allowed for public users.

Go back to "Roles & Permissions" and press the + button to create a new kind of role

The role should be named "User" and have app access

Give your newly created user role access to read jobs and userjobs. They should also have access to create userjobs. Leave everything else as is.

Now go to User Directory and create a new item by pressing the + in top right

This is just a test user, so just name it whatever you want and give it an email like "test@gmail.com" and a password. The important part is that you give it the role "User" under Admin Options.

Once created you need to manually access your database and find the role of your newly created user, located in the "directus_users" table.
The role code of your directus user should look something like this: "cdfae04d-de29-4c50-898b-566240493979"

Copy the role code.

# Setup the frontend

Git clone this project if you havent already.

In the project find the file signUp.js under src/pages/

In the file change the variable "userRole" on line 14, to the recently copied user role code from the database.

In the root of the project find the baseURL.js file and change it to where your directus instance is hosted.

Now you can run "npm install" in the frontend project.

run "npm start" to start your frontend. Make sure your directus project is also running.

Now the good job challenge is ready for use, but it will be pretty boring, because you dont have any jobs to do. To create jobs go to your directus admin page and create a job under the content tab.

#Create qr codes for your jobs:

Create a job in directus, navigate to the job page in the good job challenge and copy the url

Put the url in a QR generator (there's several on the internet). Download the created QR code and print it out on a piece of paper with a decription of the task and the amount of points the task awards.
