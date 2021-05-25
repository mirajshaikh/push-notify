const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require("node-fetch");

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

webpush.setVapidDetails(
  "mailto:tmiraj@mirajshaikh.com",
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object

  console.log("---------- start here -------");
  const subscription = JSON.parse(req.body.subs);

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify(req.body.content);
  console.log(payload);
  let responces;
  function getsubs() {
    fetch("https://push.mirajshaikh.com/siccura-coms")
      .then((res) => res.json())
      .then((json) => {
        for (jas of json) {
          let subscription = {
            endpoint: jas.PushSubs[0].endpoint,
            keys: {
              auth: jas.PushSubs[0].auth,
              p256dh: jas.PushSubs[0].p256dh,
            },
          };
          webpush
            .sendNotification(subscription, payload)
            .catch((err) => console.error(err));
        }
      });
  }
  getsubs();

  // Pass object into sendNotification
});

const port = 1339;

app.listen(port, () => console.log(`Server started on port ${port}`));
