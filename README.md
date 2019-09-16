# Asset Tracker Node

This is an NodeJS/Express app.

Database services are provided by node-postgres, for more information visit this website: `https://node-postgres.com/`

## Application structure

1. Index.js holds route export modules

2. Routes in this project are organized into separate modules, located in the modules directory

3. Database details are in config.js

4. Static image files are kept in the assets folder with asset images located in the profile images folder and profile images located in the profiles folder.

## Security

Endpoints are broken into two categories, internal and external. Internal endpoints are protected with a json token, while external endpoints are not. Entry into the app is supported by the auth module (auth.js). Token verfication is supported by the verify-token function (verify-token.js) located in the controllers folder. 

There are three external endpoints, `/register`, `/login` and `/verify`

Users may register by hitting the `/register` endpoint. Upon registration, user email addresses are checked to confirm they are unique. Passwords are encrytped and stored in the database. Registered users are created using user id 1, which is the asset-tracker robot account. Registered users are by default deactivated and connot login until the system adminstrator enables their account.

`Our pro version offers a two step verification process where a tokenized link is emailed to the user that is used to verify their email account.` The `/verify` endpoint is used for this.

Users may login by hitting the `/login` endpoint. Users are logged in using a combination of email and password. Upon logging in, the user email is found and then the unique `id` of the user is used to dycrypt the password (server side). If the decrypted password matches the password entered by the user, a token is returned.

Tokens are created using a `consumersecret` string located in the configuration file.

## Running the services

Run `node server`, the app will listen on port 8000.

## License & copyright

Licensed under the [MIT License](LICENSE).