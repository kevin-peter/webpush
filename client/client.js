const publicVapidKey = "BOd2EQ8LTe3KAgMX9lWwTlHTRzv1Iantw50Mw6pUnsNr3pcxl8iglUs-YlQEQLo4UbJk9oyXs_BxgyAe0TCqKME";

if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker.register("worker.js").then(swReg => {
    console.log("✅ Service Worker registered:", swReg);

    return swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
  }).then(sub => {
    console.log("✅ Subscription obtained:", JSON.stringify(sub));
    return fetch("/subscribe", {
      method: "POST",
      body: JSON.stringify(sub),
      headers: { "Content-Type": "application/json" }
    });
  }).then(() => {
    console.log("✅ Subscription sent to server successfully");
  }).catch(console.error);
} else {
  console.warn("❌ Push messaging not supported");
}

function urlBase64ToUint8Array(base64) {
  const pad = "=".repeat((4 - base64.length % 4) % 4);
  const base64Safe = (base64 + pad).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64Safe), c => c.charCodeAt(0));
}
