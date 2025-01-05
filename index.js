const { SerialPort } = require('serialport');
const { ReadLineParser, ReadlineParser } = require('@serialport/parser-readline');
/*const sPort = new SerialPort({path : 'COM3', baudRate: 9600});
sPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
*/
const express = require('express');
const app = express();
const port = 3000;

const request = require('request');

var data;
var tmp;
var day;
var date;
var d = 1;
var options;

app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + "/index/index.html");
});

app.get('/meal', (req, res) => {
  res.status(200).sendFile(__dirname + "/index/meal.html");
});

app.get('/api/weather', (req, res) => {
  /*if(data != tmp){
    res.status(200).json(data);
    tmp = data;
  }*/
  res.status(200).json(JSON.stringify({huminity: Math.round(Math.random() * 100), temperature: Math.round(Math.random() * 30 - 15)}));
  console.log(req);
});

app.get('/api/meal', (req, res) => {
  options = {
    uri: 'https://open.neis.go.kr/hub/mealServiceDietInfo',
    qs: {
      KEY: 'api key',
      Type: 'json',
      ATPT_OFCDC_SC_CODE: 'N10',
      SD_SCHUL_CODE: '8140085',
      MLSV_YMD: day
    }
  }
  try{
    request.post(options, (error, response, body) => {
      if(error){
        console.log(error);
        res.status(500).send(error);
      }
      else{
        let result = {
          data: []
        };
        let json = JSON.parse(body);
        if(json.mealServiceDietInfo){
        for(let i = 0; i < json.mealServiceDietInfo[1].row.length; i++){
          let meal = json.mealServiceDietInfo[1].row[i];
          result.data[i] = {
            time: meal.MLSV_YMD + "<br/>" + meal.MMEAL_SC_NM,
            menu: meal.DDISH_NM,
            description: meal.ORPLC_INFO
          };
        }
        res.status(200).json(JSON.stringify(result));
      }else{
          result.data[0] = {
            time: day,
            menu: "급식 정보가 없습니다.",
            description: "급식 정보가 없습니다."
          };
        res.status(200).json(JSON.stringify(result));
      }
      }
    });
    }catch(e){
      console.log(e);
      res.status(500).send(e);
    }
});

app.listen(port, () => {
  date = new Date();
  day = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  /*sPort.on("open", () => {
    console.log('Serial port opened');
    sPort.on("data", sData => {
      sData = sData.toString().trim();
      data = sData.split(",");
      data = JSON.stringify({huminity : data[0], temperature : data[1]});
      console.log(data);
    });
  });*/
  console.log(`Server is running at http://localhost:${port}`);
});
