const express = require("express");
const webPORT = 80;
const webapp = express();
let time = 0, stop = false;
let istimer;
const server = webapp.listen(webPORT, () => {
    console.log("Application started and Listening on port", webPORT.toString());
    console.log("use http://127.0.0.1:%d to web timer", webPORT);
    console.log("use http://127.0.0.1:%d/admin to set timer", webPORT);
});
const SocketServer = require("ws").Server;
const wss = new SocketServer({ server });
webapp.use(express.static(__dirname + "/web"));
webapp.get("/", (req, res) => {
    res.sendFile(__dirname + "/web/index.html");
});


wss.on("connection", (ws) => {

    ws.on("message", (event) => {
        let res = JSON.parse(event.toString());
        if (res.get == "start") {
            updatetime(res.data);
        }
        if (res.get == "stop") {
            stop = true;
            send(JSON.stringify({ get: "updatetime", data: 0 }))
        }
    });
    ws.on("close", () => {
        console.log("有人斷開連線");
    });
});
function updatetime(number) {

    if (time == 0) {
        send(JSON.stringify({ get: "updatetime", data: number }))
        istimer = setInterval(function () {
            if (stop == true) {
                send(JSON.stringify({ get: "updatetime", data: 0 }))
                stop = false;
                clearInterval(istimer);
                number = 0;
                time = number;
                console.log(number)

            } else {
                time = number;
                send(JSON.stringify({ get: "updatetime", data: number - 1 }))
                console.log(number - 1)

                number--;
                if (number <= 0) {
                    number = 0;
                    time = number;
                    clearInterval(istimer);

                }
            }
        }, 1000);

    }

}
function send(data) {
    let clients = wss.clients;
    clients.forEach((client) => {
        let sendData = data
        client.send(sendData);//回去的資料
    });
}