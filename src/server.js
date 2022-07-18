const express = require('express');
const app = express();
const path = require('path');
// middleware
require('dotenv').config({
  path: path.join(__dirname, '.env')
})

const morgan = require('morgan');
const cors = require('cors')
const port = process.env.PORT;


// middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use(cors())
app.use(morgan('tiny'))


// riders collection

let riders = [
  { id: 1, name: "rider1", mobile: 9876543210, email: "rider1@gmail.com", password: "rider123", location: { x: 20, y: 30 } },
  { id: 2, name: "rider2", mobile: 9876543211, email: "rider2@gmail.com", password: "rider123", location: { x: 50, y: 60 } },
]

// drivers collection
let drivers = [
  { id: 1, name: "driver1", mobile: 9876543218, email: "driver1@gmail.com", password: "driver123", availability: true, location: { x: 30, y: 60 } },
  { id: 2, name: "driver2", mobile: 9876543218, email: "driver2@gmail.com", password: "driver123", availability: true, location: { x: 70, y: 70 } },
]

// register a rider post method

app.post('/riderRegistration', (req, res) => {
  try {
    // getting rider data from body and destructuring tha data from req.body
    const { name, mobile, email, password, location } = req.body;

    // check if the rider is already registered in our app or not
    let flag = true;
    riders.find((rider) => {
      if (rider.email == email) {
        flag = false;
        return true;
      }
    });

    if (flag) {
      // save rider data in your app
      const riderId = riders.length + 1;
      riders.push({ id: riderId, name, mobile, email, password, location });

      // after saving the rider data in our app, send the response back to the client
      res.status(201).json({ status: "SUCCESS", message: `Rider registered successfully and here yours rider Id ${riderId}` });

    } else {
      // if the rider is already registered in our app than send response with error message
      res.status(201).json({ status: "FAILED", message: "Rider registration failed" });
    }

    return;
  }
  // catch the error 
  catch (err) {
    // send the error message to the client
    res.status(500).json({ status: "FAILED", message: err.message });
    return;
  }

});


// register a driver post method
app.post('/driverRegistration', (req, res) => {
  try {

    // getting driver data from body and destructuring tha data from req.body
    const { name, mobile, email, password, location, availability } = req.body;

    // check if the driver is already registered in our app or not
    let flag = true;
    drivers.find((driver) => {
      if (driver.email == email) {
        flag = false;
        return true;
      }
    });


    if (flag) {
      // save rider data in your app
      let driverId = drivers.length + 1;
      drivers.push({ id: driverId, name, mobile, email, password, location, availability });
      // after saving the driver data in our app, send the response back to the client
      res.status(201).json({ status: "SUCCESS", message: `Driver registered successfully and here is yours driver Id ${driverId}` });

    } else {
      // if the driver is already registered in our app than send response with error message
      res.status(201).json({ status: "FAILED", message: "Driver registration failed" });
    }

    return;
  }
  // catch the error 
  catch (err) {
    // send the error message to the client
    res.status(500).json({ status: "FAILED", message: err.message });
    return;
  }
});



// assigning driver to rider post method

app.post('/chooseRide', (req, res) => {
  try {

    // getting riderId from body object and destructuring tha data from req.body
    const { riderId } = req.body;

    // check if the rider is exist is our app or not
    const IsRiderExist = riders.find(rider => rider.id === riderId);

    // if the rider is not exist than throw error and send response to the client
    if (IsRiderExist === false) {
      res.status(404).json({ status: "FAILED", message: "Rider is not exist.Please register the rider first." });
      return;
    }

    let distanceBetweenRiderAndDriver = [];
    // check the distance between the rider and driver and find a drive which is nearest to rider.
    drivers.find(driver => {
      const distance = Math.sqrt(Math.pow(driver.location.x - IsRiderExist.location.x, 2) + Math.pow(driver.location.y - IsRiderExist.location.y, 2));
      // add driver id and distance in distanceBetweenRiderAndDriver array
      distanceBetweenRiderAndDriver.push({
        driverId: driver.id,
        distance: distance
      });
    });

    // finding driver id and distance which has lowest distance among all drivers

    let driverId = distanceBetweenRiderAndDriver.reduce((prev, curr) => prev.distance < curr.distance ? prev : curr).driverId;

    // check the driver availability 
    const IsDriverAvailable = drivers.map((driver, index) => {
      if (driver.id === driverId && driver.availability === true) {
        return true;
      }
      else {
        return false;
      }
    });

    if (IsDriverAvailable === false) {
      res.status(200).json({ status: "FAILED", message: "Driver is not available.Please try again later." });
      return;
    }

    // adding driver Id to rider object and rider details to driver object
    for (let i = 0; i < riders.length; i++) {
      if (riders[i].id === riderId) {
        // push driverId to rider object
        riders[i].driverId = driverId;
        break;
      }
    }

    let driver;
    for (let i = 0; i < drivers.length; i++) {
      if (drivers[i].id === driverId) {
        // push riderId to driver object
        drivers[i].riderId = riderId;
        driver = {
          name: drivers[i].name,
          mobile: drivers[i].mobile
        };
        break;
      }
    }

    // send the response to the client
    res.status(201).json({ status: "SUCCESS", message: "Your rider confirmed and here is your driver details .", driver: driver })

  }
  // catch the error  
  catch (err) {
    // send the error message to the client
    res.status(500).json({ status: "FAILED", message: err.message });
    return;
  }
})


// change the availability of driver post method
app.post('/changeAvailability', (req, res) => {
  try {

    // getting driverId, availability, location from body object and destructuring tha data from req.body
    const { driverId, availability, location } = req.body;
    // check id the driver is exist or not
    let flag = false;
    drivers.find((driver) => {
      if (driver.id == driverId) {
        flag = true;
        return true;
      }
    });

    if (flag) {
      // change the availability of driver
      drivers.find((driver) => {
        if (driver.id === driverId) {
          driver.availability = availability;
          driver.location = location;
        }
      }
      );
      // send the response to the client
      res.status(201).json({ status: "SUCCESS", message: "your availability changed successfully" });
    } else {
      // if the driver is not exist than send response with error message to the client
      res.status(201).json({ status: "FAILED", message: "Failed to change your availability" });
    }

  }
  // catch the error  
  catch (err) {
    // send the error message to the client
    res.status(500).json({ status: "FAILED", message: err.message });
    return;
  }
})


// create server and listen at port
app.listen(port, function () {
  console.log(`http://localhost:${port}`)
});
