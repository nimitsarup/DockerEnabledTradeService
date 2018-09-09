npm install
tsc .\tradeGeneration.ts
tsc .\hashRecordingService.ts
mv -force .\tradeGeneration.js .\trade_services\server\app\server.js
mv -force .\hashRecordingService.js .\trade_services\client\app\client.js
cd .\trade_services
docker-compose build
docker-compose up
