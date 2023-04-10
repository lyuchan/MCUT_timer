let url = 'ws://localhost'
var ws = new WebSocket(url)
// 監聽連線狀態
ws.onopen = () => {
    //src2.innerHTML = "<h2>已與伺服器連線</h2>"
}
ws.onclose = () => {
    //src2.innerHTML = "<h2>伺服器連線失敗，請重新整理</h2>"
}
//接收 Server 發送的訊息
ws.onmessage = event => {
    let res = JSON.parse(event.data);
    if (res.get = "updatetime") {
        // console.log(res)
        let number = formatSecond(res.data);
        let timer = document.getElementById("timer");
        timer.innerHTML = number;
        if (res.data > 30) {
            timer.style.backgroundColor = "green";
        } else if (res.data > 10) {
            timer.style.backgroundColor = "orange";
        } else if (res.data > 0) {
            timer.style.backgroundColor = "red";
        } else {
            timer.style.backgroundColor = "black";
        }
    }


}
function start() {
    let i = document.getElementById("input_box")
    if (i.value == "") {
        alert("時間不得為空!");
        return;
    }
    ws.send(JSON.stringify({ get: "start", data: i.value }));
}
function stop() {
    ws.send(JSON.stringify({ get: "stop" }));
}
function settime(sec) {
    let i = document.getElementById("input_box")
    i.value = sec;
    start();
}
function formatSecond(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = parseInt(secs - (hr * 3600) - (min * 60));

    while (min.length < 2) { min = '0' + min; }
    while (sec.length < 2) { sec = '0' + min; }
    if (hr) hr += ':';
    return autozero(min) + ':' + autozero(sec);

}
function autozero(num) {
    var i = (num + "").length;
    while (i++ < 2) num = "0" + num;
    return num
}