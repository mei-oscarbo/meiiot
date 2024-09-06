// JavaScript source code
dirip = fetch("/")

const socket = io.connect(dirip, { "forceNew": true })

const datadownload = document.getElementById('getdata')
const huad = document.getElementById('huad')

var shutdown = false

const botrange = [164, 164, 170]
const toprange = [819, 819, 819]

updateallowed = 0

function notifyMe() {
    console.log(Notification.permission)
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        new Notification("HOLA");
        // …
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                new Notification("HOLA");
                // …
            }
        });
    }
}


function poweroff() {
    socket.emit("poff", "poff")
}

function reset() {
    socket.emit("reset", "reset")
}

function update() {
    if (updateallowed == 1) {
        socket.emit("update", "update")
    } else {
        window.alert("NO HAY ACTUALIZACIONES DISPONIBLES")
    }
    
}

socket.on("updatestatus", function (data) {
    const ot = "\u00F3"
    const dot = "\u2B24"
    data = 1
    if (data == 1) {
        huad.innerHTML = "Hay una actualizaci" + ot + "n disponible"
        updateallowed = 1
    }
})

function noti() {
    Notification.requestPermission().then(perm => {
        if (perm === "granted") {
            setTimeout(() => {
                new Notification("Noti")
            }, 5000);
        }
    })
}

socket.on("startdatac", function (data) {
    dataJSON = data
    console.log(dataJSON)
    datadownload.value = dataJSON.datadownload
})

socket.on("client", function (data) {
    dataJSON = JSON.parse(data)
    console.log(dataJSON)
    datadownload.value = dataJSON.datadownload
})

datadownload.onchange = function () {
    sendJSONdata()
}

function sendJSONdata() {
    var payload = {
        "datadownload": datadownload.value,
        "r1n": "1",
        "r2n": "1",
        "r3n": "1"
    }
    socket.emit("clientmessage", JSON.stringify(payload))
    console.log(payload)
}

