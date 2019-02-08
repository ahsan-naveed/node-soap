const soap = require("soap");
const dateFormat = require("dateformat");
const cp = require("child_process");
const port = 8080;
const url = `http://localhost:${port}/wsdl?wsdl`;

// Create client
soap.createClient(url, (err, client) => {
  if (err) {
    throw err;
  }

  // Parameters of the service call: they need
  // to be called as specified in the WSDL file
  const args = JSON.stringify({ clocksync: "clocksyncRequest" });

  // start timer before sending request
  const start = new Date().getTime();

  // call the service
  client.ServerTime(args, (err, res) => {
    // end timer after getting the reponse
    const end = new Date().getTime();

    // compute RTT in ms
    const rtt = end - start;
    const halfOfRtt = Math.ceil(rtt / 2);

    if (err) {
      throw err;
    }

    // compute client's time i.e. tc = ts + dsc
    const serverTime = JSON.parse(res).serverTime - 0;
    const clientTime = serverTime + halfOfRtt;

    // format the new client time as month:day:hour:min:year.sec
    // ex 0206180219.59
    const clientDateTime = new Date(clientTime);
    const formattedTime = dateFormat(clientDateTime, "mmddHHMMyy.ss");
    const command = `sudo date ${formattedTime}`;

    // Set the client time
    console.log("Setting client time to server time...\n");
    cp.execSync(command);

    // log client-server communication
    console.log(`Client time without rtt: ${serverTime} ms`);
    console.log(`rtt: ${rtt} ms`);
    console.log(`rtt/2: ${halfOfRtt} ms`);
    console.log(`Client time with rtt: ${clientTime} ms\n`);

    // print client time after sync and server time for comparison
    console.log("After clock synchronization:");
    console.log(
      `Server time: ${dateFormat(
        new Date(serverTime),
        "dddd, mmmm dS, yyyy, h:MM:ss TT"
      )}`
    );
    console.log(
      `Client time: ${dateFormat(
        clientDateTime,
        "dddd, mmmm dS, yyyy, h:MM:ss TT"
      )}`
    );
  });
});
