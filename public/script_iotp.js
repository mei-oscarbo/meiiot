dirip = fetch("/")

console.log(dirip)

const socket = io.connect(dirip, { "forceNew": true })

const status_image = document.getElementById('status_image')
const statuss = document.getElementById('status')

const pval = document.getElementById('preading_p')
const tval = document.getElementById('preading_t')

const start = document.getElementById("start")

inprocess = 0

start.onclick = function(){
    if(!inprocess){
        socket.emit("start", "start")
        console.log("start")
        inprocess = 1
        start.style.opacity = 0.5
    }
}

a = 0;

socket.on("inprocess", function(data){
    if(data){
        inprocess = 1
        start.style.opacity = 0.5
    }else{
        inprocess = 0
        start.style.opacity = 1
    }
})


socket.on("seal_status", function(data){
    if(data == "VACUUM"){
        status_image.src = "./images/landscape_vacuum.png"
        statuss.innerHTML = "Vacío"
        statuss.style.backgroundColor = "lightblue"
    }else if(data == "FILLING"){
        status_image.src = "./images/landscape_filling.png"
        statuss.innerHTML = "Llenado"
        statuss.style.backgroundColor = "blue"
        statuss.style.color = "white"
    }else if(data == "VENT"){
        status_image.src = "./images/landscape_vent.png"
        statuss.innerHTML = "Venteo"
        statuss.style.backgroundColor = "lightgrey"
        statuss.style.color = "black"
    }else if(data == "POSITIVE"){
        status_image.src = "./images/landscape_positive.png"
        statuss.innerHTML = "Presión"
        statuss.style.backgroundColor = "red"
    }else if(data == "END"){
        status_image.src = "./images/landscape.png"
        statuss.innerHTML = "Espera"
        statuss.style.backgroundColor = "white"
        inprocess = 0
        start.style.opacity = 1
    }
})


socket.on("datafunc", function (data) {
    shutdown = false
    dataJSON = data
    t = dataJSON.sensor1
    p = dataJSON.sensor2
    //demo()

    valorreal = ((100 - 0) / (819 - 164) * (t - 164)) + 0
    t = (Math.round(valorreal * 100) / 100).toFixed(1)

    rval = p-(Math.floor(p/ 100)*100)

    if(Math.floor(p/ 100) == 8){
        rval = rval + 1000
    }
    if(Math.floor(p/ 100) == 7){
        rval = 100+rval*(900/100)
    }
    if(Math.floor(p/ 100) == 6){
        rval = (10+rval*(90/100)).toFixed(1)
    }
    if(Math.floor(p/ 100) == 5){
        rval = (1+rval/100*9).toFixed(2)
    }
    if(Math.floor(p/ 100) == 4){
        rval = (0,1+rval/100*9).toFixed(2) + "e-1"
    }
    if(Math.floor(p/ 100) == 3){
        rval = (0,1+rval/100*9).toFixed(2) + "e-2"
    }

    pval.innerHTML = rval + " mbar"
    tval.innerHTML = t + " ºC"
})