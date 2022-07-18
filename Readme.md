# Getting Started with this project

* source code: server.js

## In the project directory, you can run:

 ## Firstly, Install nodejs from this link
[install nodejs](https://nodejs.org/en/download/)

## then, Install package dependencies from this command

### `npm install`


## create .env file add following variables
PORT = 3001
DB = mongoDB URL
secretKey = key

## start nodejs server using this command

### `npm start`

## Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

## API Endpoints

## 1. riderRegistration (POST)- http://localhost:3001/riderRegistration 
To register a rider with the following parameters:
* name - name of the rider 
* mobile : mobile number of rider 
* email : email id of rider
* password : password for the authentication
* location : location of the rider

## 2. driverRegistration (POST)- http://localhost:3001/driverRegistration 
To register a driver with the following parameters:
* name - name of the driver 
* mobile : mobile number of driver 
* email : email id of driver
* password : password for the authentication
* location : location of the driver
* availability : availability of the driver

## 3. chooseRide (POST)- http://localhost:3001/chooseRide 
To choose a ride with the following parameters:
* riderId - id of the rider 

## 4. changeAvailability (POST)- http://localhost:3001/changeAvailability 
To change availability of the driver with the following parameters:
* driverId - id of the driver
* availability : availability of the driver
* location : location of the driver

