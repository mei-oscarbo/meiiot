// JavaScript source code
dirip = fetch("/")

console.log(dirip)

const socket = io.connect(dirip, { "forceNew": true })

const datadownload = document.getElementById('datadownload')
const ddb = document.getElementById('ddb')

const barra1 = document.getElementById('sensor1')
const barra2 = document.getElementById('sensor2')
const barra3 = document.getElementById('sensor3')

const value1 = document.getElementById('sensor1value')
const value2 = document.getElementById('sensor2value')
const value3 = document.getElementById('sensor3value')

const maxvalue1 = document.getElementById('sensor1maxvalue')
const maxvalue2 = document.getElementById('sensor2maxvalue')
const maxvalue3 = document.getElementById('sensor3maxvalue')

const minvalue1 = document.getElementById('sensor1minvalue')
const minvalue2 = document.getElementById('sensor2minvalue')
const minvalue3 = document.getElementById('sensor3minvalue')

barralim1 = []
barralim2 = []

barralim1[1] = document.getElementById('barlim11')
barralim2[1] = document.getElementById('barlim12')
barralim1[2] = document.getElementById('barlim21')
barralim2[2] = document.getElementById('barlim22')
barralim1[3] = document.getElementById('barlim31')
barralim2[3] = document.getElementById('barlim32')

nav = []

nav[1] = document.getElementById("nav1")
nav[2] = document.getElementById("nav2")
nav[3] = document.getElementById("nav3")
config = document.getElementById("config")

text = []

text[1] = document.getElementById("text1")
text[2] = document.getElementById("text2")
text[3] = document.getElementById("text3")

var shutdown = false

//const botrange = [164, 164, 164]
//const toprange = [819, 819, 819]

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

s[1] = new sensor(0, 0, 0, 0, 0, 0, 0)
s[2] = new sensor(0, 0, 0, 0, 0, 0, 0)
s[3] = new sensor(0, 0, 0, 0, 0, 0, 0)

r[1] = new relay(0, 0, 0, 0)
r[2] = new relay(0, 0, 0, 0)
r[3] = new relay(0, 0, 0, 0)

socket.on("datafunc", function (data) {
    shutdown = false
    dataJSON = data
    s[1].value = dataJSON.sensor1
    s[2].value = dataJSON.sensor2
    s[3].value = dataJSON.sensor3
    //demo()

    move(s[1].value, barra1, value1, maxvalue1, minvalue1, s[1].max, s[1].unit, 1)
    move(s[2].value, barra2, value2, maxvalue2, minvalue2, s[2].max, s[2].unit, 2)
    move(s[3].value, barra3, value3, maxvalue3, minvalue3, s[3].max, s[3].unit, 3)
})
socket.on("relaystatus", function (data) {
    console.log(data)
    shutdown = false
    dataJSON = data
    r1 = dataJSON.r1
    r2 = dataJSON.r2
    r3 = dataJSON.r3

    setcolor(r1, barralim1[1], barralim2[1])
    setcolor(r2, barralim1[2], barralim2[2])
    setcolor(r3, barralim1[3], barralim2[3])
})

socket.on("client", function (data) {
    dataJSON = JSON.parse(data)
    if (dataJSON.sens == 1 || dataJSON.sens == 2 || dataJSON.sens == 3) {
        s[dataJSON.sens].top = dataJSON.top
        s[dataJSON.sens].bot = dataJSON.bot
        s[dataJSON.sens].unit = dataJSON.unit
        s[dataJSON.sens].text = dataJSON.text
        s[dataJSON.sens].max = dataJSON.max
        text[dataJSON.sens].innerHTML = s[dataJSON.sens].text
        nav[dataJSON.sens].innerHTML = s[dataJSON.sens].text
        move(s[dataJSON.sens].value, barra1, value1, maxvalue1, minvalue1, s[dataJSON.sens].max, s[dataJSON.sens].unit, dataJSON.sens)
    }
    else if (dataJSON.rele == 1 || dataJSON.rele == 2 || dataJSON.rele == 3) {
        r[dataJSON.rele].max = dataJSON.max
        r[dataJSON.rele].min = dataJSON.min
        r[dataJSON.rele].cont = dataJSON.cont
        r[dataJSON.rele].sens = dataJSON.sensor
        movebar(r[dataJSON.rele].min, r[dataJSON.rele].max, r[dataJSON.rele].cont, barralim1[dataJSON.rele], barralim2[dataJSON.rele], r[dataJSON.rele].sens)
    }
})

socket.on("startdata", function (dataJSON) {
    if (dataJSON.sens == 1 || dataJSON.sens == 2 || dataJSON.sens == 3) {
        s[dataJSON.sens].top = dataJSON.top
        s[dataJSON.sens].bot = dataJSON.bot
        s[dataJSON.sens].unit = dataJSON.unit
        s[dataJSON.sens].text = dataJSON.text
        s[dataJSON.sens].max = dataJSON.max
        text[dataJSON.sens].innerHTML = s[dataJSON.sens].text
        nav[dataJSON.sens].innerHTML = s[dataJSON.sens].text
        move(s[dataJSON.sens].value, barra1, value1, maxvalue1, minvalue1, s[dataJSON.sens].max, s[dataJSON.sens].unit, dataJSON.sens)
    }
    else if (dataJSON.rele == 1 || dataJSON.rele == 2 || dataJSON.rele == 3) {
        r[dataJSON.rele].max = dataJSON.max
        r[dataJSON.rele].min = dataJSON.min
        r[dataJSON.rele].cont = dataJSON.cont
        r[dataJSON.rele].sens = dataJSON.sensor
        movebar(r[dataJSON.rele].min, r[dataJSON.rele].max, r[dataJSON.rele].cont, barralim1[dataJSON.rele], barralim2[dataJSON.rele], r[dataJSON.rele].sens)
    }
    else {
        console.log(dataJSON)
        dataJSON = sortByMonthThenDay(dataJSON)
        console.log(dataJSON)
        for (const element of dataJSON) {
            var option = document.createElement("option");
            option.text = element;
            datadownload.add(option);
        }
    }
})


function poweroff() {
    socket.emit("poff", "poff")
}

function move(datasensor, barra, value, maxvalue, minvalue, max, unit, nosens) {
    if (max == 2060) {
        valormaxi = 60
        valormin = -20
    } else {
        valormaxi = max
        valormin = 0
    }
    if (valormaxi - valormin >= 30) {
        decimals = 1
    } else {
        decimals = 2
    }
    valorreal = ((valormaxi - valormin) / (s[nosens].top - s[nosens].bot) * (datasensor - s[nosens].bot)) + valormin
    //console.log(valorreal)
    minvalue.style.bottom = 55 + "px"
    maxvalue.style.bottom = 430 + "px"
    minvalue.textContent = valormin + ".00"
    maxvalue.textContent = valormaxi + ".00"

    rval = (Math.round(valorreal * 100) / 100).toFixed(decimals)

    const gr = "\u00B0"

    if (unit == "grausc") { unit = gr + "C" }

    height = 100 / (s[nosens].top - s[nosens].bot) * (datasensor - s[nosens].bot)
    bottom = -401 + height * 4
    if (valorreal >= valormin * 1 - (valormaxi - valormin) * 0.02 && (valorreal < (valormaxi * 1 + (valormaxi - valormin) * 0.02))) {
        barra.style.setProperty("background-color", "#284193")
        value.textContent = rval + " " + unit;
        barra.style.height = height + '%';
        barra.style.bottom = bottom + "px";
        value.style.bottom = bottom + 410 + "px";
    }
    if (valorreal < valormin && valorreal >= valormin*1-(valormaxi-valormin)*0.02) {
        barra.style.setProperty("background-color", "#284193")
        value.textContent = "0.00"
        barra.style.height = 0 + '%';
        barra.style.bottom = -400 + "px";
        value.style.bottom = -400 + 410 + "px";
    }
    if (valorreal < valormin*1 - (valormaxi - valormin) * 0.02 && valorreal >= valormin*1 - (valormaxi - valormin) * 0.2) {
        barra.style.setProperty("background-color", "#ff0000")
        barra.style.height = 0 + '%';
        barra.style.bottom = -400 + "px";
        value.style.bottom = -400 + 410 + "px";
        value.textContent = "ERROR"
    }
    if (valorreal < valormin*1 - (valormaxi - valormin) * 0.2) {
        barra.style.setProperty("background-color", "#ff0000")
        barra.style.height = 0 + '%';
        barra.style.bottom = -400 + "px";
        value.style.bottom = -400 + 410 + "px";
        value.textContent = "OFF"
    }
    if (valorreal >= valormaxi*1 + (valormaxi - valormin) * 0.02 && valorreal < valormaxi*1 + (valormaxi - valormin) * 0.2) {
        value.textContent = "ERROR"
        barra.style.height = 100 + '%';
        barra.style.bottom = 0 + "px";
        barra.style.setProperty("background-color", "#ff0000")
        value.style.bottom = 0 + 410 + "px";
    }
    if (valorreal >= valormaxi*1 + (valormaxi - valormin) * 0.2) {
        value.textContent = "ON"
        barra.style.height = 100 + '%';
        barra.style.bottom = 0 + "px";
        barra.style.setProperty("background-color", "#00FF00")
        value.style.bottom = 0 + 410 + "px";
    }
    if (valorreal >= valormaxi && (valorreal < (valormaxi*1 + (valormaxi - valormin) * 0.02))) {
        barra.style.setProperty("background-color", "#284193")
        value.textContent = (Math.round(valormaxi * 100) / 100).toFixed(2); 
        barra.style.height = 100 + '%';
        barra.style.bottom = 0 + "px";
        value.style.bottom = 0 + 410 + "px";
    }
    if (height > 95) {
        maxvalue.style.setProperty("color", "white")
    } else { maxvalue.style.setProperty("color", "black") }

    if (height < 5) {
        minvalue.style.setProperty("color", "white")
    } else { minvalue.style.setProperty("color", "black") }
     
}
function movebar(bot, top, cont, barralim, barralim2) {
    if (cont == "sin") {
        barralim.style.display = "none"
        barralim2.style.display = "none"
    }
    if (cont == "NA") {
        barralim.style.display = "block"
        barralim2.style.display = "none"
        a = bot * 0.401
        barralim.style.top = 0 + "px";
        barralim.style.height = 401 - a + "px";

    }
    if (cont == "NC") {
        barralim.style.display = "block"
        barralim2.style.display = "none"
        a = bot * 0.401
        barralim.style.top = 401 - a + "px";
        barralim.style.height = a + "px";
    }
    if (cont == "VNA") {
        barralim.style.display = "block"
        barralim2.style.display = "none"
        a = bot * 0.401
        b = top * 0.401
        barralim.style.top = 401 - b + "px";
        barralim.style.height = b - a + "px";
    }
    if (cont == "VNC") {
        barralim.style.display = "block"
        barralim2.style.display = "block"
        a = bot * 0.401
        barralim.style.top = 401 - a + "px";
        barralim.style.height = a + "px";

        b = top * 0.401
        barralim2.style.top = 0 + "px";
        barralim2.style.height = 401 - b + "px";
    }
}

function setcolor(ledstat, barralim1, barralim2) {
    if (ledstat == 0) {
        barralim1.style.setProperty("background-color", "#bf0000")
        barralim2.style.setProperty("background-color", "#bf0000")
    }
    else {
        barralim1.style.setProperty("background-color", "#ff0000")
        barralim2.style.setProperty("background-color", "#ff0000")
    }
}

function datadownloads() {
    socket.emit("download", datadownload.value)
    ddb.href = "/files/" + datadownload.value
}

socket.on("updatestatus", function (data) {
    const ot = "\u00F3"
    const dot = "\u2B24"
    if (data == 1) {
        config.innerHTML = "Configuraci" + ot + "n " + dot
    }
})

function demo() {
    if (Math.random() >= 0.95) {
        a = 0.5
    }
    else { a = 0 }
    if (Math.random() >= 0.95) {
        b = 0.5
    }
    else { b = 0 }
    if (Math.random() >= 0.65) {
        c = 0.5
    }
    else { c = 0 }
    s[1].value = 350+a
    s[2].value = 500+b
    s[3].value = 700+c
}

function parseDate(filename) {
    filename = filename.split("-")
    dayarray = filename[0].split("_")
    yeararray = filename[2].split(".")
    day = dayarray[1]
    month = filename[1] - 1
    year = yeararray[0]
    return new Date(year, month, day);
}

// Sorting function
function sortByMonthThenDay(data) {
    return data.sort((a, b) => {
        const dateA = parseDate(a);
        const dateB = parseDate(b);

        // Check if either date is null
        if (!dateA || !dateB) {
            return 0;
        }

        if (dateA.getMonth() == dateB.getMonth()) {
            return dateA.getDate() - dateB.getDate();
        } else {
            return dateA.getMonth() - dateB.getMonth();
        }
    });
}