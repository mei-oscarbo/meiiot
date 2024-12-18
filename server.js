#!/usr/bin/local
const express = require("express")
const app = express()
const http = require("http")
const server = require("http").Server(app)
//const Gpio = require("onoff").Gpio
const io = require("socket.io")(server)
var ip = require("ip");
const fs = require("fs")
var ss = require('socket.io-stream');
//const exec = require("child_process").exec

//console.dir(ip.address('Wi-Fi'));

var stream = ss.createStream();

var SerialPort = require('serialport');
const { Z_ASCII } = require("zlib");
const parsers = SerialPort.parsers;
var datapayload = null
var ledstat = "as"
var led1pre = "a"
var led2pre = "a"
var led3pre = "a"
var dataJSON = null;
var isready = 0
var confirmed = 0
var trycount = 0

let callCount = 0;
let values = {
    sensor1: [],
    sensor2: [],
    sensor3: []
};

an1 = 164
an2 = 164
an3 = 164
bn1 = 164
bn2 = 164
bn3 = 164
cn1 = 164
cn2 = 164
cn3 = 164

updateneeded = 0

send = false

class relay {
    constructor(max, min, cont, sensor) {
        this.max = max
        this.min = min
        this.cont = cont
        this.sensor = sensor
    }
}

class sensor {
    constructor(number, unit, max, text, relays, bot, top) {
        this.number = number
        this.unit = unit
        this.max = max
        this.text = text
        this.relays = relays
        this.bot = bot
        this.top = top
        this.value = 164
    }
}

r = []
s = []


app.use(express.static("public"))
app.use(express.json())

storageddata = fs.readFileSync("./storage.json")
JSONstoreddata = JSON.parse(storageddata)
datarecord = JSONstoreddata.datadownload

sval = [0,0,0,0]

storageddata = fs.readFileSync("./r1.json")
JSONstoreddata = JSON.parse(storageddata)
r[1] = new relay(JSONstoreddata.max, JSONstoreddata.min, JSONstoreddata.cont, JSONstoreddata.sensor)

sval[JSONstoreddata.sensor] = sval[JSONstoreddata.sensor] + 100

storageddata = fs.readFileSync("./r2.json")
JSONstoreddata = JSON.parse(storageddata)
r[2] = new relay(JSONstoreddata.max, JSONstoreddata.min, JSONstoreddata.cont, JSONstoreddata.sensor)

sval[JSONstoreddata.sensor] = sval[JSONstoreddata.sensor] + 10

storageddata = fs.readFileSync("./r3.json")
JSONstoreddata = JSON.parse(storageddata)
r[3] = new relay(JSONstoreddata.max, JSONstoreddata.min, JSONstoreddata.cont, JSONstoreddata.sensor)

sval[JSONstoreddata.sensor] = sval[JSONstoreddata.sensor] + 1

storageddata = fs.readFileSync("./storage1.json")
JSONstoreddata = JSON.parse(storageddata)
s[1] = new sensor(JSONstoreddata.sens, JSONstoreddata.unit, JSONstoreddata.max, JSONstoreddata.text, sval[1], JSONstoreddata.bot, JSONstoreddata.top)

storageddata = fs.readFileSync("./storage2.json")
JSONstoreddata = JSON.parse(storageddata)
s[2] = new sensor(JSONstoreddata.sens, JSONstoreddata.unit, JSONstoreddata.max, JSONstoreddata.text, sval[2], JSONstoreddata.bot, JSONstoreddata.top)

storageddata = fs.readFileSync("./storage3.json")
JSONstoreddata = JSON.parse(storageddata)
s[3] = new sensor(JSONstoreddata.sens, JSONstoreddata.unit, JSONstoreddata.max, JSONstoreddata.text, sval[3], JSONstoreddata.bot, JSONstoreddata.top)

sec = 0

const parser = new parsers.Readline({
    delimiter: '\r\n'
});

const port = 3000

app.use((req, res)=>{
    res.status(404)
    res.send("Error 404: Resource not found")
})

app.on("/", (req, res) => {
    res.send(ip.address())
})

io.on("connection", function (socket) {
    console.log("Conexion por socket")
	io.sockets.emit("request", "A")
    storageddata = fs.readFileSync("./storage.json")
    JSONstoreddata = JSON.parse(storageddata)
    socket.emit("startdatac", JSONstoreddata)
    storageddata = fs.readFileSync("./storage1.json")
    JSONstoreddata = JSON.parse(storageddata)
    socket.emit("startdata", JSONstoreddata)
    storageddata = fs.readFileSync("./storage2.json")
    JSONstoreddata = JSON.parse(storageddata)
    socket.emit("startdata", JSONstoreddata)
    storageddata = fs.readFileSync("./storage3.json")
    JSONstoreddata = JSON.parse(storageddata)
    socket.emit("startdata", JSONstoreddata)
    storageddata = fs.readFileSync("./r1.json")
    JSONstoreddata = JSON.parse(storageddata)
    socket.emit("startdata", JSONstoreddata)
    storageddata = fs.readFileSync("./r2.json")
    JSONstoreddata = JSON.parse(storageddata)
    socket.emit("startdata", JSONstoreddata)
    storageddata = fs.readFileSync("./r3.json")
    JSONstoreddata = JSON.parse(storageddata)
    socket.emit("startdata", JSONstoreddata)
    storageddata = fs.readdirSync("./public/data/")
    socket.emit("startdata", storageddata)
    setInterval(function () {
	if(dataJSON != null){
		socket.emit("datafunc", dataJSON)
	}
	socket.emit("relaystatus", ledstat)
	if(isready == 1 && confirmed ==0){
		console.log("SENDING READY MESSAGE")
		socket.emit("isready", filename)
		trycount = trycount +1
	}
    if(confirmed == 1){
		trycount = 0
		isready = 0
		confirmed = 0
	}
    if(trycount >= 5){
		console.log("ERROR SENDING FILE")
		trycount = 0
		isready = 0
		confirmed = 0
	    	socket.emit("error", "ERROR SENDING FILE")
	}
    }, 1000)
    socket.on("confirmation", function(data){
	    confirmed = data
    })
    socket.on("pidata", function (data) {
	    if(data != null){
		    dataJSON = data
	    	    s[1].value = dataJSON.sensor1
		    s[2].value = dataJSON.sensor2
		    s[3].value = dataJSON.sensor3
		    ledstat = ledstatus()
	    }
    })
    socket.on("file", function(data){
	    fs.writeFileSync("./public/files/"+filename, data)
	    console.log(filename +" DOWNLOADED")
	    isready = 1
    })
    socket.on("storedfiles", function (data) {
	     io.sockets.emit("startdata", data)
    })
    socket.on("clientmessage", function (data) {
	    console.log(data)
        io.sockets.emit("client", data)
        JSONdata = JSON.parse(data)
        tostorage = JSON.stringify(JSONdata)
        if (JSONdata.sens == 1 || JSONdata.sens == 2 || JSONdata.sens == 3) {
            s[JSONdata.sens].top = JSONdata.top
            s[JSONdata.sens].bot = JSONdata.bot
            s[JSONdata.sens].unit = JSONdata.unit
            s[JSONdata.sens].text = JSONdata.text
            s[JSONdata.sens].max = JSONdata.max
        }
        if (JSONdata.rele == 1 || JSONdata.rele == 2 || JSONdata.rele == 3) {
            r[JSONdata.rele].max = JSONdata.max
            r[JSONdata.rele].min = JSONdata.min
            r[JSONdata.rele].sensor = JSONdata.sensor
            r[JSONdata.rele].cont = JSONdata.cont
        }
        if (JSONdata.sens == "1") {
            fs.writeFileSync("./storage1.json", tostorage)
        }
        else if (JSONdata.sens == "2") {
            fs.writeFileSync("./storage2.json", tostorage)
        }
        else if (JSONdata.sens == "3") {
            fs.writeFileSync("./storage3.json", tostorage)
        }
        else if (JSONdata.rele == "1") {
            fs.writeFileSync("./r1.json", tostorage)
        }
        else if (JSONdata.rele == "2") {
            fs.writeFileSync("./r2.json", tostorage)
        }
        else if (JSONdata.rele == "3") {
            fs.writeFileSync("./r3.json", tostorage)
        }
        else {
            fs.writeFileSync("./storage.json", tostorage)
            datarecord = JSONdata.datadownload
            r1s = JSONdata.r1s
            r2s = JSONdata.r2s
            r3s = JSONdata.r3s
        }
    })

    socket.on("download", function (data) {
	console.log("requesting "+data+" file")
	io.sockets.emit('download', data);
	filename = data;
    })
    socket.on("poff", function () {
        console.log("APAGALOOOOOO")
        //exec("sh shutdown.sh")
    })
    socket.on("reset", function () {
        console.log("RESET")
        //exec("sh reset.sh")
    })
    socket.on("update", function () {
        console.log("UPDATE")
        //exec("sh /home/mei004/update.sh")
    })
})

/*pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
    if (err) { //if an error
        console.error('There was an error', err); //output error message to console
        return;
    }
    //exec("sh shutdown.sh")
});*/


server.listen(port, () =>{
    console.log("Tutto benne des de la ip " + ip.address() + " al port " + port)
    storageddata = fs.readFileSync("./storage1.json")
    JSONstoreddata = JSON.parse(storageddata)
    console.log(JSONstoreddata)
    s[JSONstoreddata.sens].top = JSONstoreddata.top
    s[JSONstoreddata.sens].bot = JSONstoreddata.bot
    s[JSONstoreddata.sens].unit = JSONstoreddata.unit
    s[JSONstoreddata.sens].text = JSONstoreddata.text
    s[JSONstoreddata.sens].max = JSONstoreddata.max

    storageddata = fs.readFileSync("./storage2.json")
    JSONstoreddata = JSON.parse(storageddata)
    console.log(JSONstoreddata)
    s[JSONstoreddata.sens].top = JSONstoreddata.top
    s[JSONstoreddata.sens].bot = JSONstoreddata.bot
    s[JSONstoreddata.sens].unit = JSONstoreddata.unit
    s[JSONstoreddata.sens].text = JSONstoreddata.text
    s[JSONstoreddata.sens].max = JSONstoreddata.max

    storageddata = fs.readFileSync("./storage3.json")
    JSONstoreddata = JSON.parse(storageddata)
    console.log(JSONstoreddata)
    s[JSONstoreddata.sens].top = JSONstoreddata.top
    s[JSONstoreddata.sens].bot = JSONstoreddata.bot
    s[JSONstoreddata.sens].unit = JSONstoreddata.unit
    s[JSONstoreddata.sens].text = JSONstoreddata.text
    s[JSONstoreddata.sens].max = JSONstoreddata.max

    //dummy = ledstatus()
})

setInterval(function () {
    //serverled.writeSync(serverled.readSync()^1)
}, 50)

/*setInterval(function () {
    localfile = fs.readFileSync('./localver.txt', 'utf-8');
    const file = fs.createWriteStream("ver.txt");
    const request = http.get("http://app.mei.es/ver.txt", function (response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            //console.log("Download Completed");
        });
    });
    cloudfile = fs.readFileSync('./ver.txt', 'utf-8');
    if (localfile != cloudfile) {
        updateneeded = 1
    }
}, 6000)*/

function ledstatus() {
    led1status = setled(r[1].min, r[1].max, r[1].cont, s[r[1].sensor].value, 1, led1pre)
    led1pre = led1status
    led2status = setled(r[2].min, r[2].max, r[2].cont, s[r[2].sensor].value, 2, led2pre)
    led2pre = led2status
    led3status = setled(r[3].min, r[3].max, r[3].cont, s[r[3].sensor].value, 3, led3pre)
    led3pre = led3status
    var ledstatus = {
        "r1": led1status,
        "r2": led2status,
        "r3": led3status
    }
    return ledstatus
}

function setled(min, max, cont, data, led, ledpre) {
    data = (data - s[led].bot) * 1000 / (s[led].top - s[led].bot)

    if (cont == "sin") {
        //console.log("LED " + led + " OFF")
        //leds[led].writeSync(0)
        return 0
    }
    if (cont == "NA") {
        a = min
        b = data
        if (a < b) {
            //console.log("LED " + led + " ON")
            //leds[led].writeSync(1)
            return 1
        } else {
            //console.log("LED " + led + " OFF")
            //leds[led].writeSync(0)
            return 0
        }
    }
    if (cont == "NC") {
        a = min
        b = data
        if (a > b) {
            //console.log("LED " + led + " ON")
            //leds[led].writeSync(1)
            return 1
        } else {
            //console.log("LED " + led + " OFF")
            //leds[led].writeSync(0)
            return 0
        }
    }
    if (cont == "VNA") {
        a = min
        b = max
        c = data
        if (c > a && c < b) {
            //console.log("LED " + led + " ON")
            //leds[led].writeSync(1)
            return 1
        } else {
            //console.log("LED " + led + " OFF")
            //leds[led].writeSync(0)
            return 0
        }
    }
    if (cont == "VNC") {
        a = min
        b = max
        c = data
        if (c > b || c < a) {
            //console.log("LED " + led + " ON")
            //leds[led].writeSync(1)
            return 1
        } else {
            //console.log("LED " + led + " OFF")
            //leds[led].writeSync(0)
            return 0
        }
    }
    if (cont == "NAH") {
        a = min
        b = max
        c = data
        if (c > b) {
            //console.log("LED " + led + " ON")
            //leds[led].writeSync(1)
            return 1
        }
        if (a > c) {
            //console.log("LED " + led + " OFF")
            //leds[led].writeSync(0)
            return 0
        }
        if (c > a && c < b && ledpre == 0) {
            //console.log("LED " + led + " OFF")
            //leds[led].writeSync(0)
            return 0
        } 
        if (c > a && c < b && ledpre == 1) {
            //console.log("LED " + led + " ON")
            //leds[led].writeSync(1)
            return 1
        }
    }
        if (cont == "NCH") {
            a = min
            b = max
            c = data
            if (c > b) {
                //console.log("LED " + led + " OFF")
                //leds[led].writeSync(0)
                return 0
            }
            if (a > c) {
                //console.log("LED " + led + " ON")
                //leds[led].writeSync(1)
                return 1
            }
            if (c > a && c < b && ledpre == 0) {
                //console.log("LED " + led + " OFF")
                //leds[led].writeSync(0)
                return 0
            }
            if (c > a && c < b && ledpre == 1) {
                //console.log("LED " + led + " ON")
                //leds[led].writeSync(1)
                return 1
            }
        }
}

function addcsvline(sensor1, sensor2, sensor3) {
    var fecha = new Date();
    temps = fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds()
    month = (fecha.getMonth() + 1)
    day = fecha.getDate()
    dia = day + "-" + month + "-" + fecha.getFullYear()
    csv = temps + " " + dia + ";" + sensor1 + ";" + sensor2 + ";" + sensor3

    require('dns').resolve('www.google.com', function (err) {
        if (err) {
            console.log("No connection");
        } else {
            fs.appendFile('./public/data/data_' + dia + '.csv', csv + "\r\n", function (err) {
                if (err) throw err;
                console.log('Saved at ', temps);
            });
        }
    });
    return fecha.getSeconds()
}

function createfile(filename) {
    head = "Fecha;" + s[1].text + ";" + s[2].text + ";" + s[3].text
    file = fs.readFileSync('./public/data/' + filename, 'utf-8');
    fs.writeFileSync('./public/files/' + filename, head + "\r\n", function (err) {
        if (err) throw err;
    });

    if (s[1].max == 2060) {
        valormaxi1 = 60
        valormin1 = -20
    } else {
        valormaxi1 = s[1].max
        valormin1 = 0
    }

    if (s[2].max == 2060) {
        valormaxi2 = 60
        valormin2 = -20
    } else {
        valormaxi2 = s[2].max
        valormin2 = 0
    }

    if (s[3].max == 2060) {
        valormaxi3 = 60
        valormin3 = -20
    } else {
        valormaxi3 = s[3].max
        valormin3 = 0
    }

    const rows = file.split('\n');
    const twoDimensionalArray = rows.map(row => row.split(';'));

    for (var i = 0; i < rows.length-1; i++) {
        twoDimensionalArray[i][1] = ((valormaxi1 - valormin1) / (s[1].top - s[1].bot) * (twoDimensionalArray[i][1] - s[1].bot)) + valormin1
        twoDimensionalArray[i][1] = (Math.round(twoDimensionalArray[i][1] * 100) / 100).toFixed(2)
        tdas1 = Math.sign(twoDimensionalArray[i][1])
        twoDimensionalArray[i][1] = Math.floor(Math.abs(twoDimensionalArray[i][1])) + "," + (Math.floor((Math.abs(twoDimensionalArray[i][1]) - Math.floor(Math.abs(twoDimensionalArray[i][1])))*100))
        if (tdas1 < 0) { twoDimensionalArray[i][1] = "-" + twoDimensionalArray[i][1] }
        twoDimensionalArray[i][2] = ((valormaxi2 - valormin2) / (s[2].top - s[2].bot) * (twoDimensionalArray[i][2] - s[2].bot)) + valormin2
        twoDimensionalArray[i][2] = (Math.round(twoDimensionalArray[i][2] * 100) / 100).toFixed(2)
        tdas2 = Math.sign(twoDimensionalArray[i][2])
        twoDimensionalArray[i][2] = Math.floor(Math.abs(twoDimensionalArray[i][2])) + "," + (Math.floor((Math.abs(twoDimensionalArray[i][2]) - Math.floor(Math.abs(twoDimensionalArray[i][2]))) * 100))
        if (tdas2 < 0) { twoDimensionalArray[i][2] = "-" + twoDimensionalArray[i][2] }
        twoDimensionalArray[i][3] = ((valormaxi3 - valormin3) / (s[3].top - s[3].bot) * (twoDimensionalArray[i][3] - s[3].bot)) + valormin3
        twoDimensionalArray[i][3] = (Math.round(twoDimensionalArray[i][3] * 100) / 100).toFixed(2)
        tdas3 = Math.sign(twoDimensionalArray[i][3])
        twoDimensionalArray[i][3] = Math.floor(Math.abs(twoDimensionalArray[i][3])) + "," + (Math.floor((Math.abs(twoDimensionalArray[i][3]) - Math.floor(Math.abs(twoDimensionalArray[i][3]))) * 100))
        if (tdas3 < 0) { twoDimensionalArray[i][3] = "-" + twoDimensionalArray[i][3] }

        line = twoDimensionalArray[i][0] + ";" + twoDimensionalArray[i][1] + ";" + twoDimensionalArray[i][2] + ";" + twoDimensionalArray[i][3]
        fs.appendFileSync('./public/files/' + filename, line + "\r\n", function (err) {
            if (err) throw err;
        });
    }
}

