var MicrosecondsTimer = require('microseconds');
var NanoTimer = require('nanotimer');
var chalk = require('chalk');
import {Socket, createSocket} from "zmq";
import {SHA256 } from 'crypto-js';
const address = process.env.ZMQ_BIND_ADDRESS || `tcp://127.0.0.1:3000`;

export class TradeGenerator
{
  zmqSocket: Socket;
  tradeGenerationTime : string;
  numTrades : number;
  nenoTimer : any;
  start: any;

  constructor(zeroMqIpPort : string,tradeGenerationTime: string) 
  {
    this.numTrades = 0;
    this.nenoTimer = new NanoTimer();
    this.zmqSocket = createSocket('push');
    this.zmqSocket.bindSync(zeroMqIpPort)
    this.tradeGenerationTime = tradeGenerationTime;
    this.start = MicrosecondsTimer.now();

    setInterval(() => {
      var elapsedTime = MicrosecondsTimer.now() - this.start;
      console.log(chalk.red("TradeGenerator: " + this.numTrades + " generated in " + MicrosecondsTimer.since(this.start) + " μs."));
    }, 15000);
  }

  StartTrade()
  {
    this.nenoTimer.setInterval(this.Tradefunction.bind(this), '', trades.tradeGenerationTime);
  }

  Tradefunction() 
  {	 
        this.numTrades++;
        var timeNow = MicrosecondsTimer.now();
        var trade = "Commodity: 'GOLD', UnitPrice: '100.23', Currency: 'RUBLE', Quantity: '100'";
        var sha256 = SHA256(timeNow + "-" + trade).toString();
        //console.log( timeNow + "-" + sha256);     
        this.zmqSocket.send( timeNow + "-" + sha256);       
                    
    }
}

var trades = new TradeGenerator(address, '1m');
trades.StartTrade();