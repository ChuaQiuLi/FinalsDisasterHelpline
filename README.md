**Frontend Setup:** 

To run the frontend locally, api.js needs to be updated with the IP address of your laptop so that it can function properly. Currently, in api.js, the IP address stated belongs to the Render backend. Next, run' npm install' to install the packages used for this project. npm expo start command is used to start the frontend.
The application is being uploaded on Google Play Store in: https://play.google.com/store/apps/details?id=com.qiuli.DisasterHelpline 


**Backend Setup:** 

I have hosted the backend on a Render server, and it might take some time to start up the application as the server will be in an idle state when not in use. 
I have hosted the PostgreSQL database on Supabase, and the database URL in the .env file source code is the one that Prisma will use to communicate with the database.

I have also seeded data into the PostgreSQL database on Supabase. To seed data to the database locally, the npm run seed:all command needs to be used and run.

To run the backend locally, npm install needs to run to install the packages used. The node index.js command is used to start the backend.






