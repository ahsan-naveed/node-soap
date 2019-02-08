/*jslint node: true */
"use strict";

const soap = require("soap");
const express = require("express");
const fs = require("fs");
const port = 8080;

// @WebMethod
const serverTime = args => {
  const date = new Date();
  const { clocksync } = JSON.parse(args);
  console.log(`@WebMethod invoked at ${date.toISOString()}`);
  return clocksync === "clocksyncRequest"
    ? JSON.stringify({ serverTime: `${date.getTime()}` })
    : JSON.stringify({ serverTime: "Invalid args." });
};

// @WebService
const serverTimeServiceObject = {
  ServerTimeService: {
    ServerTimeServiceSoapPort: {
      ServerTime: serverTime
    },
    ServerTimeServiceSoap12Port: {
      ServerTime: serverTime
    }
  }
};

// load the WSDL file - service definition
const xml = fs.readFileSync("serverTimeService.wsdl", "utf8");

// create express app
const app = express();

// root handler
app.get("/", function(req, res) {
  res.send("Serving Node Soap Web Service...");
});

// Launch the server and listen on *port*
app.listen(port, function() {
  console.log("Server is listening on port " + port);
  const wsdlPath = "/wsdl";

  // create SOAP server that listens on *path*
  soap.listen(app, wsdlPath, serverTimeServiceObject, xml);

  console.log(
    "Visit http://localhost:" +
      port +
      wsdlPath +
      "?wsdl to see if the service is working"
  );
});
