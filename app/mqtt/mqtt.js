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
          printCMS(JSON.parse(message), cms);
          break;
        case topic == "/data/" + loggerId:
          printCMS(JSON.parse(message), data);
          break;
        case topic == "/status/" + loggerId:
          printStatus(JSON.parse(message));
          break;
        case topic == "/statechange/" + loggerId:
          printStateChange(JSON.parse(message));
          break;
      }
    });
    var printCMS = async function (message, model) {
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

    var printData = async function (message) {
      console.log("Received Message Data: ", message.msgCount);
      var dataVal = new data(message);
      dataVal
        .save()
        .then((req, res) => {
          console.log("Data Saved Successfully!");
        })
        .catch((err) => {
          return res.status(400).JSON({ error: err });
        });
      // data
      //   .findOne({ loggerId: loggerId })
      //   .then((Data) => {
      //     if (Data) {
      //       data.updateOne({ _id: Data._id }, message).then((res) => {
      //         console.log("Data updated Successfully!");
      //       });
      //       return;
      //     } else {
      //       dataVal.save().then((req, res) => {
      //         console.log("Data Saved Successfully!");
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     return res.status(401).json({ error: err });
      //   });
    };
    var printStatus = async function (message) {
      var statusData = new status(message);
      statusData
        .save()
        .then((req, res) => {
          console.log("Status data Saved Successfully!");
        })
        .catch((err) => {
          return res.status(400).JSON({ error: err });
        });
      // status
      //   .findOne({ loggerId: loggerId })
      //   .then((data) => {
      //     if (data) {
      //       status.updateOne({ _id: data._id }, message).then((res) => {
      //         console.log("Status Data updated Successfully!");
      //       });
      //       return;
      //     } else {
      //       statusData.save().then((req, res) => {
      //         console.log("Status data Saved Successfully!");
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     return res.status(401).json({ error: err });
      //   });
    };

    var printStateChange = async function (message) {
      var stateChangeData = new stateChange(message);
      stateChangeData
        .save()
        .then((req, res) => {
          console.log("State Change data Saved Successfully!");
        })
        .catch((err) => {
          return res.status(500).json({ error: err });
        });
      // statechange
      //   .findOne({ loggerId: loggerId })
      //   .then((data) => {
      //     if (data) {
      //       statechange.updateOne({ _id: data._id }, message).then((res) => {
      //         console.log("State Change Data updated Successfully!");
      //       });
      //       return;
      //     } else {
      //       stateChange.save().then((req, res) => {
      //         console.log("State Change data Saved Successfully!");
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     return res.status(401).json({ error: err });
      //   });
    };
  });
}
exports.mqtt = { init: init };
