var express = require('express');
var http = require('http');

var app = express();

app.use(express.static(__dirname));

// app.configure(function() {
//     app.use(express.static(__dirname));
//     app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var Game = function() {
    this.server = http.createServer(app);
    this.io = require('socket.io').listen(this.server);
    this.events = [];
    this.clients = [];
    this.host = null;
};

Game.prototype = {
    startServer: function() {
        this.io.sockets.on('connection', function(socket) {
            this.onSocketConnect(socket);

            socket.on('disconnect', function() {
                this.onSocketDisconnect(socket);
            }.bind(this));
        }.bind(this));

        console.log('Open localhost:8080 on your browser.');
        console.log('Listening...');

        this.monitorHost();

        setInterval(function() {
            if (!this.host) return console.log('No host');
            if (!this.host) return console.log('Host has no player');

            console.log('Host: ', this.host.player.id);
        }.bind(this), 2000);

        this.server.listen(process.env.PORT || 8080);
    },

    setHost: function(client) {
        console.log('Setting host to player: ' + client.player.id);
        this.host = client;
    },

    findNewHost: function() {
        if (this.clients.length > 0) {
            var i = getRandomInt(0, this.clients.length-1);
            var client = this.clients[i];

            // Make sure client had time to initialize the player
            if (client) {
                this.setHost(client);

                console.log('New host: ' + this.host.player.id);
                this.io.sockets.emit('setHost', {player: this.host.player});
            }
        }
    },

    getClientHost: function() {
        if (!this.clients.length) { return; }
        return this.clients.reduce(function(previousClient, currentClient) { if (previousClient && previousClient.player.id === this.host.player.id) { return previousClient; } else if (currentClient.player.id === this.host.player.id) { return currentClient; }});
    },

    findClientBySocket: function(socket) {
        if (!this.clients.length) { return; }
        return this.clients.reduce(function(previousClient, currentClient) { if (previousClient && previousClient.socket === socket) { return previousClient; } else if (currentClient.socket === socket) { return currentClient; }});
    },

    addClient: function(client) {
        console.log('Adding player: ' + client.player.id);
        this.clients.push(client);
    },

    removeClient: function(client) {
        console.log('Removing player: ' + client.player.id);

        this.clients.splice(this.clients.indexOf(client), 1);
    },

    fireEvent: function(socket, event) {
        socket.emit('events', {events: [event]});
    },

    fireAllPlayers: function(event) {
        this.io.sockets.emit('events', {events: [event]});
    },

    parseEvent: function(socket, event) {
        if (event.key === 'newPlayer') {
            console.log('Handshaking...');

            this.addClient({socket: socket, player: event.info.player});

            // If it's the first client or there's no hosts, lets set it as the new host
            if (!this.host) {
                this.setHost(this.clients[this.clients.length-1]);
                console.log('New host: ' + this.host.player.id);
            }

            this.fireEvent(socket, {key: 'setHost', info: {player: this.host.player}});
        } else if (event.key === 'this.findNewHost') {
            console.log("Finding new host....");
            var client = this.findClientBySocket(socket);
            this.removeClient(client);
            this.host = null;
            this.findNewHost();
        } else {
            //socket.broadcast.emit(event.key, event.info);
        }
    },

    onSocketConnect: function(socket) {
        console.log('New connection.. waiting for handshake');

        // TODO: give them 10 seconds to identify as a newPlayer, or cut them off

        socket.on('events', function(data) {
            //console.log('Incoming events: ' + data);
            data = JSON.parse(data);

            data.events.forEach(function(event) { this.parseEvent(socket, event); }.bind(this));

            socket.broadcast.emit('events', data);
        }.bind(this));
    },

    onSocketDisconnect: function(socket) {
        var client = this.findClientBySocket(socket);

        if (!client) { return; }

        this.removeClient(client);

        // If this client was the host,
        // and there's at least one more client connected,
        // lets choose a new random host,
        // and broadcast it to everybody
        if (client.player.id === this.host.player.id) {
            this.host = null;
            this.findNewHost();
        }

        if (this.clients.length === 0) {
            this.host = null;
        }

        this.fireAllPlayers({key: 'playerLeave', info: {player: client.player}});
    },

    // Monitor the clients to make sure they are still defined
    monitorHost: function() {
        if (!this.host) {
            this.findNewHost();
        }

        setTimeout(this.monitorHost.bind(this), 50);
    }
};

var server = new Game();

server.startServer();
