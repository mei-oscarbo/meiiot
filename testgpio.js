const Gpio = require("onoff").Gpio;

const led = new Gpio(17, "out");

const iv = setInterval(_ => led.writeSync(led.readSync() ^1), 200);

setTimeout(_ => {
	clearInterval(iv);
	led.unexport();
}, 5000);
