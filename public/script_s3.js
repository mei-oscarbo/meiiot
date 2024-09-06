// JavaScript source code
dirip = fetch("/")

const socket = io.connect(dirip, { "forceNew": true })

const barra1 = document.getElementById('sensor1')

barralim1 = []
barralim2 = []

barralim1[1] = document.getElementById('barlim11')
barralim2[1] = document.getElementById('barlim12')
barralim1[2] = document.getElementById('barlim21')
barralim2[2] = document.getElementById('barlim22')
barralim1[3] = document.getElementById('barlim31')
barralim2[3] = document.getElementById('barlim32')


const value1 = document.getElementById('sensor1value')


const maxvalue1 = document.getElementById('sensor1maxvalue')


const minvalue1 = document.getElementById('sensor1minvalue')

const contact1 = document.getElementById('contact1')

text = []
nav = []

text[3] = document.getElementById("texts1")
nav[1] = document.getElementById("nav1")
nav[2] = document.getElementById("nav2")
nav[3] = document.getElementById("nav3")

var form = document.getElementById("max11")
var textlim = document.getElementById("lim1")
var textlim2 = document.getElementById("lim12")
var sliderbar = document.getElementById("sliderbar")
var sliderbarb = document.getElementById("sliderbarb")
const unit1 = document.getElementById('unit1')

const textunitat = document.getElementById("textunitat")
const textunitat2 = document.getElementById("textunitat2")
const unitat2 = document.getElementById("unitat2")
const textunitat3 = document.getElementById("textunitat3")
const unitat3 = document.getElementById("unitat3")

const form3 = document.getElementById("form3")
const form2 = document.getElementById("form2")

const superior = document.getElementById("superior")
const inferior = document.getElementById("inferior")

const ctx = document.getElementById('myChart').getContext('2d');

const config = document.getElementById("config")

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
        this.value = null
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

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Datos en tiempo real',
            data: [],
            fill: false,
            borderColor: '#284193',
            backgroundColor: '#284193',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second'
                },
                title: {
                    display: true,
                    text: 'Hora'
                }
            },
            y: {
                title: {
                    display: true,
                    text: s[1].unit
                }
            }
        }
    }
});


socket.on("datafunc", function (data) {
    dataJSON = data
    s[3].value = dataJSON.sensor2
    move(s[3].value, barra1, value1, maxvalue1, minvalue1, s[3].max, s[3].unit, 3)
})

socket.on("relaystatus", function (data) {
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
    startbar()
    startunit()
    movebar()
    original = s[3].text
    text[3].value = original
    unitsel()
})

socket.on("startdata", function (dataJSON) {
    if (dataJSON.sens == 1 || dataJSON.sens == 2 || dataJSON.sens == 3) {
        s[dataJSON.sens].top = dataJSON.top
        s[dataJSON.sens].bot = dataJSON.bot
        s[dataJSON.sens].unit = dataJSON.unit
        s[dataJSON.sens].text = dataJSON.text
        s[dataJSON.sens].max = dataJSON.max
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
    startbar()
    startunit()
    movebar()
    original = s[3].text
    text[3].value = original
    unitsel()
})

function startbar() {
    sliderbar.value = r[3].min
    sliderbarb.value = r[3].max
    maxvalue1.style.bottom = 430 + "px"
    minvalue1.textContent = "0.00"
    maxvalue1.textContent = s[3].max + ".00"
}

function startunit() {

    if (s[3].max == 10) {
        form.value = "10";
    }
    if (s[3].max == 100) {
        form.value = "100";
    }
    if (s[3].max == 2060) {
        form.value = "2060";
    }

    if (s[3].unit == "bar") {
        unit1.value = "bar";
    }
    if (s[3].unit == "grausc") {
        unit1.value = "grausc";
    }
    if (s[3].unit == "mh2o") {
        unit1.value = "mh2o"
    }

    contact1.value = r[3].cont
    contact()

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
    minvalue.style.bottom = 55 + "px"
    maxvalue.style.bottom = 430 + "px"
    minvalue.textContent = valormin + ".00"
    maxvalue.textContent = valormaxi + ".00"

    const gr = "\u00B0"

    if (unit == "grausc") { unit = gr + "C" }

    height = 100 / (s[nosens].top - s[nosens].bot) * (datasensor - s[nosens].bot)
    bottom = -401 + height * 4
    rval = (Math.round(valorreal * 100) / 100).toFixed(decimals)

    if (valorreal >= valormin * 1 - (valormaxi - valormin) * 0.02 && (valorreal < (valormaxi * 1 + (valormaxi - valormin) * 0.02))) {
        barra.style.setProperty("background-color", "#284193")
        value.textContent = rval + " " + unit;
        barra.style.height = height + '%';
        barra.style.bottom = bottom + "px";
        value.style.bottom = bottom + 410 + "px";
        addDataPoint(rval)
    }

    if (valorreal < valormin * 1 - (valormaxi - valormin) * 0.02 && valorreal >= valormin * 1 - (valormaxi - valormin) * 0.2) {
        barra.style.setProperty("background-color", "#ff0000")
        barra.style.height = 0 + '%';
        barra.style.bottom = -400 + "px";
        value.style.bottom = -400 + 410 + "px";
        value.textContent = "ERROR"
    }
    if (valorreal < valormin * 1 - (valormaxi - valormin) * 0.2) {
        barra.style.setProperty("background-color", "#ff0000")
        barra.style.height = 0 + '%';
        barra.style.bottom = -400 + "px";
        value.style.bottom = -400 + 410 + "px";
        value.textContent = "OFF"
    }
    if (valorreal >= valormaxi * 1 + (valormaxi - valormin) * 0.02 && valorreal < valormaxi * 1 + (valormaxi - valormin) * 0.15) {
        value.textContent = "ERROR"
        barra.style.height = 100 + '%';
        barra.style.bottom = 0 + "px";
        barra.style.setProperty("background-color", "#ff0000")
        value.style.bottom = 0 + 410 + "px";
    }
    if (valorreal >= valormaxi * 1 + (valormaxi - valormin) * 0.15) {
        value.textContent = "ON"
        barra.style.height = 100 + '%';
        barra.style.bottom = 0 + "px";
        barra.style.setProperty("background-color", "#00FF00")
        value.style.bottom = 0 + 410 + "px";
    }
    if (height > 95) {
        maxvalue.style.setProperty("color", "white")
    } else { maxvalue.style.setProperty("color", "black") }

    if (height < 5) {
        minvalue.style.setProperty("color", "white")
    } else { minvalue.style.setProperty("color", "black") }



}


contact1.oninput = function () {
    contact()
    sendRELAYdata(sliderbar.value, sliderbarb.value, r[3].cont)
    movebar()
}
sliderbar.oninput = function () {
    moveslider()
}

sliderbarb.oninput = function () {
    movesliderb()
}

function contact() {
    if (s[3].max == 2060) {
        valormaxi = 60
        valormin = -20
    } else {
        valormaxi = s[3].max
        valormin = 0
    }
    const it = "\u00ed"
    r[3].cont = contact1.value
    textlim.textContent = (Math.round(sliderbar.value * (valormaxi - valormin)) / 1000 + valormin).toFixed(2);
    textlim2.textContent = (Math.round(sliderbarb.value * (valormaxi - valormin)) / 1000 + valormin).toFixed(2);
    barralim1[1].style.display = "none"
    barralim2[1].style.display = "none"
    barralim1[2].style.display = "none"
    barralim2[2].style.display = "none"

    if (r[3].cont == "sin") {
        sliderbar.disabled = true
        sliderbarb.disabled = true
        form3.style.display = "none"
        form2.style.display = "none"
        barralim1[3].style.display = "none"
        barralim2[3].style.display = "none"
    }
    if (r[3].cont == "NA") {
        sliderbar.disabled = false
        sliderbarb.disabled = true
        form2.style.display = "block"
        form3.style.display = "none"
        superior.textContent = "l" + it + "mite:"
        barralim1[3].style.display = "block"
        barralim2[3].style.display = "none"
    }
    if (r[3].cont == "NC") {
        sliderbar.disabled = false
        sliderbarb.disabled = true
        form2.style.display = "block"
        form3.style.display = "none"
        superior.textContent = "l" + it + "mite:"
        barralim1[3].style.display = "block"
        barralim2[3].style.display = "none"
    }
    if (r[3].cont == "VNA") {
        sliderbar.disabled = false
        sliderbarb.disabled = false
        form2.style.display = "block"
        form3.style.display = "block"
        superior.textContent = "l" + it + "mite inferior:"
        inferior.textContent = "l" + it + "mite superior:"
        barralim1[3].style.display = "block"
        barralim2[3].style.display = "none"

    }
    if (r[3].cont == "VNC") {
        sliderbar.disabled = false
        sliderbarb.disabled = false
        form2.style.display = "block"
        form3.style.display = "block"
        superior.textContent = "l" + it + "mite inferior:"
        inferior.textContent = "l" + it + "mite superior:"
        barralim1[3].style.display = "block"
        barralim2[3].style.display = "block"
    }
    if (r[3].cont == "NAH") {
        sliderbar.disabled = false
        sliderbarb.disabled = false
        form2.style.display = "block"
        form3.style.display = "block"
        superior.textContent = "de apertura:"
        inferior.textContent = "de cierre:"
        barralim1[3].style.display = "block"
        barralim2[3].style.display = "none"
    }
    if (r[3].cont == "NCH") {
        sliderbar.disabled = false
        sliderbarb.disabled = false
        form2.style.display = "block"
        form3.style.display = "block"
        superior.textContent = "de cierre:"
        inferior.textContent = "de apertura:"
        barralim1[3].style.display = "block"
        barralim2[3].style.display = "none"
    }

}

function zero() {
    s[3].bot = s[3].value
    sendJSONdata(original)
}

function span() {
    s[1].top = s[1].value
    sendJSONdata(original)
}

function calfab() {
    s[3].bot = "164"
    s[3].top = "819"
    sendJSONdata(original)
}

function moveslider() {
    if (sliderbar.value >= sliderbarb.value && (r[3].cont == "VNC" || r[3].cont == "VNA" || r[3].cont == "NAH" || r[3].cont == "NCH")) {
        sliderbar.value = sliderbarb.value
    }
    textlim.textContent = (Math.round(sliderbar.value * (valormaxi - valormin)) / 1000 + valormin).toFixed(2);
    sendRELAYdata(sliderbar.value, sliderbarb.value, r[3].cont)
    movebar()
}

function movesliderb() {
    if (sliderbarb.value <= sliderbar.value) {
        sliderbarb.value = sliderbar.value
    }
    textlim2.textContent = (Math.round(sliderbarb.value * (valormaxi - valormin)) / 1000 + valormin).toFixed(2);
    sendRELAYdata(sliderbar.value, sliderbarb.value, r[3].cont)
    movebar()
}

function movebar() {
    if (r[3].cont == "NA") {
        a = sliderbar.value * 0.401
        barralim1[3].style.top = 0 + "px";
        barralim1[3].style.height = 401 - a + "px";
    }
    if (r[3].cont == "NC") {
        a = sliderbar.value * 0.401
        barralim1[3].style.top = 401 - a + "px";
        barralim1[3].style.height = a + "px";
    }
    if (r[3].cont == "VNA") {
        a = sliderbar.value * 0.401
        b = sliderbarb.value * 0.401
        barralim1[3].style.top = 401 - b + "px";
        barralim1[3].style.height = b - a + "px";
    }
    if (r[3].cont == "VNC") {
        a = sliderbar.value * 0.401
        barralim1[3].style.top = 401 - a + "px";
        barralim1[3].style.height = a + "px";

        b = sliderbarb.value * 0.401
        barralim2[3].style.top = 0 + "px";
        barralim2[3].style.height = 401 - b + "px";
    }
    if (r[3].cont == "NAH") {
        a = sliderbar.value * 0.401
        b = sliderbarb.value * 0.401
        barralim1[3].style.top = 401 - b + "px";
        barralim1[3].style.height = b - a + "px";
    }
    if (r[3].cont == "NCH") {
        a = sliderbar.value * 0.401
        b = sliderbarb.value * 0.401
        barralim1[3].style.top = 401 - b + "px";
        barralim1[3].style.height = b - a + "px";
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
function addDataPoint(yValue) {
    const currentTime = new Date();
    myChart.data.labels.push(currentTime);
    myChart.data.datasets[0].data.push(yValue);
    myChart.update();
}

unit1.oninput = function () {
    unitsel()
    sendJSONdata(original)
}

max11.oninput = function () {
    updatemax()
}

function updatemax() {
    s[3].max = max11.value
    sendJSONdata(original)
}
function unitsel() {
    const ot = "\u00F3"
    const gr = "\u00B0"
    s[3].unit = unit1.value
    if (s[3].unit == "bar") {
        textunitat.textContent = "presi" + ot + "n:";
        textunitat2.textContent = "Presi" + ot + "n";
        unitat2.textContent = "bar";
        textunitat3.textContent = "Presi" + ot + "n";
        unitat3.textContent = "bar";
        myChart.options.scales.y.title.text = "Presion"
    }
    else if (s[3].unit == "mh2o") {
        textunitat.textContent = "altura:";
        textunitat2.textContent = "Altura agua";
        unitat2.textContent = "mH2O";
        textunitat3.textContent = "Altura agua";
        unitat3.textContent = "mH2O";
        myChart.options.scales.y.title.text = "Nivel"
    }
    else {
        textunitat.textContent = "temperatura:";
        textunitat2.textContent = "Temperatura";
        unitat2.textContent = gr + "C";
        textunitat3.textContent = "Temperatura";
        unitat3.textContent = gr + "C";
        myChart.options.scales.y.title.text = "Temperatura"
    }
}

function editar() {
    text[3].readOnly = false
    text[3].style.border = "solid";
}

function defaultevent() {
    if (text[3].value != original) {
        text[3].readOnly = true
        text[3].style.border = "none";
        sendJSONdata(text[3].value)

    }
    nav[3].innerHTML = text[3].value
    original = text[3].value
}

socket.on("updatestatus", function (data) {
    const ot = "\u00F3"
    const dot = "\u2B24"
    if (data == 1) {
        config.innerHTML = "Configuraci" + ot + "n " + dot
    }
})

function sendJSONdata(text) {
    var payload = {
        "sens": "3",
        "top": s[3].top,
        "bot": s[3].bot,
        "unit": s[3].unit,
        "max": s[3].max,
        "text": text,
    }
    socket.emit("clientmessage", JSON.stringify(payload))
    console.log(payload)
}

function sendRELAYdata(bot, top, cont) {
    var payload = {
        "rele": "3",
        "sensor": "3",
        "max": top,
        "min": bot,
        "cont": cont
    }
    socket.emit("clientmessage", JSON.stringify(payload))
    console.log(payload)
}
