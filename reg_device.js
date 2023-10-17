
// const  SerialPort = require("serialport");
// const  ReadlineParser = require("serialport/parser-readline");

const { SerialPort, ReadlineParser } = require("serialport");
const socketIOClient = require("socket.io-client");

const socket = socketIOClient("http://203.154.216.10:8002", {
  path: "/api/socket",
});

socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });


let port;

const parser = new ReadlineParser({
  delimiter: "\r",
});

let selectedPort = "";

// Function to open the selected serial port
function openSerialPort() {
  if (selectedPort) {
    if (port && parser) {
      parser.removeAllListeners("data");
    }

    port = new SerialPort({
      path: selectedPort,
      baudRate: 9600,
    });

    

    port.pipe(parser);

    port.on("open", () => {
      console.log(`Port ${selectedPort} open`);
    });

    parser.on("data", (data) => {
      console.log("Received data:", data);
      socket.emit("register_device_data", data);
    });

    port.write("ROBOT PLEASE RESPOND\n");
  } else {
    console.log("No selected port.");
  }
}

// Function to periodically list and check available serial ports
function checkSerialPorts() {
  SerialPort.list()
    .then((ports) => {
      const foundPort = ports.find((port) => {
        return port.vendorId === "1A86" && port.productId === "7523";
      });

      if (foundPort) {
        if (selectedPort !== foundPort.path) {
          // USB device change detected, update the selected port
          selectedPort = foundPort.path;
          console.log("Barcode scanner attached:", selectedPort);
          socket.emit("register_device_data", 'online');
          openSerialPort();
        }
      } else {
        if (selectedPort) {
          
          // The selected USB device was detached
          console.log("Barcode scanner detached.");
          selectedPort = "";
          socket.emit("register_device_data", 'offline');

        }
      }
      // Schedule the next check
      setTimeout(checkSerialPorts, 3000); // Check every 5 seconds (adjust as needed)
    })
    .catch((err) => {
      console.error("Error listing serial ports:", err);
    });
}

// Start the initial check and subsequent periodic checks
checkSerialPorts();


