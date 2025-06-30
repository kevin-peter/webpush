console.log("Service Worker loaded...");

self.addEventListener("push", e => {
  console.log("📨 Push event received:", e);
  const data = e.data ? e.data.json() : { title: "No data", body: "Empty push" };
  console.log("📨 Push payload:", data);

  self.registration.showNotification(data.title, {
    body: data.body,
    requireInteraction: true,
    icon: "icon.png",
    vibrate: [200, 100, 200]
  });
});
