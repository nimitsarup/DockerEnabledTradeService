import {Socket, createSocket} from "zmq";
var MicrosecondsTimer = require('microseconds');
const loki = require("lokijs");
var chalk = require('chalk'); 

const address = process.env.ZMQ_PUB_ADDRESS || `tcp://127.0.0.1:3000`;

export class TradeRecoder
{
    zmqSocket: Socket;
    database: any;
    db_table: any;
    minDuration: Number | undefined;
    maxDuration: Number | undefined;
    numTrades : number;

    constructor(zeroMqIpPort : string)
    {
        this.zmqSocket = createSocket('pull');;
        this.zmqSocket.connect(zeroMqIpPort);
        this.database =new loki("quickstart.db");
        this.db_table = this.database.addCollection('TRADES');
        this.numTrades = 0;

        setInterval(() => {
            console.log(chalk.green("TradeRecoder: " + this.numTrades + " trades serviced. MinDuration: " + this.minDuration + ", MaxDuration: " + this.maxDuration + " (μs)."));
          }, 15000);
    }

    StartService()
    {
        this.zmqSocket.on(`message`, (msg) => {
            var parts = msg.toString().split('-');
            this.numTrades++;
            //console.log(parts);
            // save to in-memory lokidb
            this.db_table.insert({ID: parts[0], HASH: parts[1]});
    
            var timeTaken = MicrosecondsTimer.now() - Number(parts[0]);
            if (this.minDuration == undefined) this.minDuration = timeTaken;
            if (this.maxDuration == undefined) this.maxDuration = timeTaken;
    
            if(timeTaken < this.minDuration) this.minDuration = timeTaken;
            if(timeTaken > this.maxDuration ) this.maxDuration = timeTaken;
        });
    }
}

var recorder = new TradeRecoder(address);
recorder.StartService();