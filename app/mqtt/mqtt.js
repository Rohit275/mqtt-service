const mqtt = require("mqtt");

const res = require("express/lib/response");
const Config = require("../../config/config");

const cms = require("../models/topics/cms");
const data = require("../models/topics/data");
const status = require("../models/topics/status");
const stateChange = require("../models/topics/stateChange");

//const connectUrl = `mqtt://localhost:1883`;
const connectUrl = `mqtt://${Config.mqtt.host}:${Config.mqtt.port}`;

var client = mqtt.connect(connectUrl);

async function init() {
  client.on("connect", async function () {
    console.log("COnnected to MQTT");
    await client.subscribe("/status/#");
    await client.subscribe("/cms/#");
    await client.subscribe("/data/#");
    await client.subscribe("/statechange/#");

    client.on("message", async function (topic, message) {
      loggerIdArr = [];
      loggerIdArr = topic.split("/", 3);
      loggerId = loggerIdArr[2];

      console.log("Topics subscribed id : ", loggerId);
      switch (true) {
        case topic == "/cms/" + loggerId:
          messages = JSON.stringify(JSON.parse(message));
          saveData(JSON.parse(message), cms);
          break;
        case topic == "/data/" + loggerId:
          saveData(JSON.parse(message), data);
          break;
        case topic == "/status/" + loggerId:
          saveData(JSON.parse(message), status);
          break;
        case topic == "/statechange/" + loggerId:
          saveData(JSON.parse(message), stateChange);
          break;
      }
    });
    var saveData = async function (message, model) {
      var modelData = new model(message);
      modelData
        .save()
        .then((req, res) => {
          console.log("Data Saved Successfully!");
        })
        .catch((err) => {
          return res.status(400).JSON({ error: err });
        });
    };
  });
}
exports.mqtt = { init: init };
