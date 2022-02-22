const mqtt = require("mqtt");

const host = "localhost";
const port = "1883";
const connectUrl = `mqtt://${host}:${port}`;

var client = mqtt.connect(connectUrl);
const topic1 = "/cms/#";
const topic2 = "/data/#";

start();

async function start() {
  client.on("connect", async function () {
    console.log("COnnected to MQTT");
    // await client.subscribe("");
    await client.subscribe("/cms/#");
    await client.subscribe("/data/#");

    console.log(Object.keys(client._resubscribeTopics));
    client.on("message", async function (topic, message) {
      // console.log("Topics subscribed: ", topic.split.);
      loggerIdArr = [];
      loggerIdArr = topic.split("/", 3);
      loggerId = loggerIdArr[2];

      console.log("Topics subscribed id : ", loggerId);
      switch (true) {
        case topic == "/cms/" + loggerId:
          messages = JSON.stringify(JSON.parse(message));
          // console.log("Received Message:", topic, message.toString());
          printCMS(JSON.parse(message));
          break;

        case topic == "/data/" + loggerId:
          console.log("Received Message:", topic, message.toString());
          break;
      }
    });
    var printCMS = async function (message) {
      console.log("Received Message CMS:", message.timeStamp);
    };
  });
}

// client.on("connect", function () {
//   client.subscribe("/cms/#", () => {
//     console.log(`Client Subscribed to topic1 '${topic1}'`);
//   });
//   // client.subscribe([topic2], () => {
//   //   console.log(`Client Subscribed to topic '${topic2}'`);
//   // });
//   console.log("connected");
// });

// client.on("message", (topic, payload) => {
//   // console.log("Type of payload", payload.values().timeStamp);
//   switch (topic) {
//     case topic1:
//       return console.log("Topics: ", topic);
//     case topic2:
//       return console.log("Topics: ", topic);
//   }
//   // console.log("Received Message:", topic, payload.toString());
//   //   const buf = Buffer.from(payload);
//   //   const json = JSON.stringify(payload);
//   //   console.log("Received payload Message:", payload.toJSON());
// });
