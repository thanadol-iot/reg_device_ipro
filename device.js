const usb = require('usb');

const devices = usb.getDeviceList();

devices.forEach((device) => {
    console.log(`---------------------------------------------------------------------------------`);
	console.log(`Device: ${device.deviceDescriptor.idVendor}: ${device.deviceDescriptor.idProduct}`);
	console.log(` Type: ${device.deviceDescriptor.iProduct}`);
	console.log(` Bus: ${device.busNumber}`);
	console.log(` Address: ${device.deviceAddress}`);
	console.log(` Ports: ${device.portNumbers}`);
	console.log(` Manufacturer: ${device.deviceDescriptor.iManufacturer}`);
	console.log(` Serial Number: ${device.deviceDescriptor.iSerialNumber}`);
});
