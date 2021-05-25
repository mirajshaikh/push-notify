const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
addEventListener("load", async () => {
  send();
});
// Register SW, Register Push, Send Push
let pushtext, pushdec, pushimg, subscription;
async function send() {
  // Register Service Worker
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/",
  });
  console.log("Service Worker Registered...");

  // Register Push
  console.log("Registering Push...");
  subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log("Push Registered...", subscription);
  let responce = JSON.parse(JSON.stringify(subscription));
  console.log(responce);
  let data = {
    PushSubs: [
      {
        endpoint: responce.endpoint,
        auth: responce.keys.auth,
        p256dh: responce.keys.p256dh,
        optat: window.location.href,
      },
    ],
  };

  let raw = JSON.stringify(data);
  senddata(raw);
  console.log("--------- RAW Data ---------", raw);
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
function text(value) {
  pushtext = value;
  let text = document.querySelector("#pushtext");
  text.innerHTML = value;
}
function decs(value) {
  pushdec = value;
  let decs = document.querySelector("#pushdec");
  decs.innerHTML = value;
}
function imgss(value) {
  pushimg = value;
  let imgs = document.querySelector("#imgs");
  imgs.src = value;
}

function sendpush() {
  // Send Push Notification
  console.log("Sending Push...");
  fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify({
      subs: JSON.stringify(subscription),
      content: {
        title: pushtext,
        body: pushdec,
        logo: pushimg,
      },
    }),
    headers: {
      "content-type": "application/json",
    },
  });
  console.log("Push Sent...");
}

let senddata = (data) => {
  console.log("------------ Adding ----------", data);

  fetch("https://push.mirajshaikh.com/siccura-coms", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
