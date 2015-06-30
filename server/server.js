var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 4000});

console.log('Server started on 4000');
var map = [414, 425, 500, 435, 489, 505, 494, 450, 456];
var plnum = 0;

wss.on('connection', function(ws) {
    var n = plnum;
    ws.send(JSON.stringify({type: 'init', plnum: plnum, map: map}));
    for (var i in wss.clients) {
        if (ws != wss.clients[i]) {
            wss.clients[i].send(JSON.stringify({
                type: 'adduser'
            }));
        }
    }
    plnum += 1;
    ws.on('message', function(message) {
        var msg = JSON.parse(message);
        switch (msg.action) {
        case 'kill': 
            for (var i in wss.clients) {
                wss.clients[i].send(JSON.stringify({
                    type: 'kill',
                    pl: msg.pl,
                }));
            }
            break;
        case 'hide': 
            for (var i in wss.clients) {
                wss.clients[i].send(JSON.stringify({
                    type: 'hide',
                    pl: msg.pl,
                }));
            }
            break;
        case 'attack': 
            for (var i in wss.clients) {
                wss.clients[i].send(JSON.stringify({
                    type: 'attack',
                    pl: msg.pl,
                }));
            }
            break;
        case 'update2t':
            for (var i in wss.clients) {
                if (ws != wss.clients[i]) {
                    wss.clients[i].send(JSON.stringify({
                        type: 'update2t',
                        pl: n,
                        pos: msg.pos
                    }));
                }
            }
            break;



        default:
            for (var i in wss.clients) {
                if (ws != wss.clients[i]) {
                    wss.clients[i].send(JSON.stringify({
                        type: 'update',
                        pl: n,
                        pos: msg.pos
                    }));
                }
            }
            break;
        }
    });
    ws.on('close', function () {
        for (var i in wss.clients) {
            if (ws != wss.clients[i]) {
                wss.clients[i].send(JSON.stringify({
                    type: 'close',
                    pl: n,
                }));
            }
        }        
    });
});

