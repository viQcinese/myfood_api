# 🍱 MyFood API 
#### Backend API for an imaginary service called MyFood, that brings together restaurants and customers

## Table of Contents
* [Requirements](#requirements)
* [Installation](#installation)
* [Documentation](#documentation)
* [Technologies](#technologies)
* [Features](#features)
* [Contributions](#contributions)

## Requirements
- NodeJS and NPM
- MongoDB

## Installation

#### Clone this repository on your machine
```
git clone https://github.com/viQcinese/myfood_api.git
```

#### Install the required packages with npm
```
npm install
```

#### Set Enviroment Variables
- Change directory to /config
- Rename config_model.env to config.env
- Edit config.env following the instructions commented inside the file

Set your MongoDB URI in order to use the server routes to interact with the database
```env
MONGO_URI=
```

Set your Geocoder Provider variables in order to use the Geocoder related routes
```env
GEOCODER_API_PROVIDER= 
GEOCODER_API_KEY= 
GEOCODER_API_SECRET=
```

Set the JSON Web Token variables in order to implement authentication
```
JWT_SECRET=yoursecretsecret
JWT_EXPIRATION=10d
JWT_COOKIE_EXPIRATION=10
```

Set your SMTP Provider variables in order to use the reset password and forget password routes
```
SMTP_HOST= 
SMTP_PORT=2525 
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=noreply@myfood.com
SMTP_FROM_NAME=MyFood
```

You can run the server on production mode
```
npm start
```

Or you can run the server on development mode, if you have nodemon installed
```
npm run dev
```

## Documentation 
You can find the HTML with the routes documentation on myfood_api_documentation.html
Or you can access it online at https://documenter.getpostman.com/view/11911541/T1LFpBS9?version=latest

## Technologies
<img align="left" alt="NodeJS" height="20px" src="https://raw.githubusercontent.com/viQcinese/viQcinese/master/src/node-dot-js.svg" />Node JS <br>
<img align="left" alt="NodeJS" height="20px" src="https://raw.githubusercontent.com/viQcinese/viQcinese/master/src/mongodb.svg" />MongoDB


## Features
- CRUD routes for Restaurants, Menu Items, Reviews and Users
- Authentication Routes for Register, Login, Logout and Forget Password
- Advanced queries with mongoose query parameters
- Geocode routes to return resources according to distance
- Authentication with both JWT and Cookies

## Contributions
Contributions are always welcome! If you take an interest in the code, feel free to make pull requests or get in touch with me on github 😊

