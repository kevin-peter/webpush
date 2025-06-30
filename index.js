const express = require("express");
const webpush = require("web-push");
const path = require("path");
const getDbConnection = require("./db/connect.js");

const app = express();
app.use(express.json());

const publicVapidKey = process.env.VAPID_PUBLIC_KEY || "BOd2EQ8LTe3KAgMX9lWwTlHTRzv1Iantw50Mw6pUnsNr3pcxl8iglUs-YlQEQLo4UbJk9oyXs_BxgyAe0TCqKME";
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || "4AoSsRHFaHv0Fupd2NRtrungJF2jkqgccTu-WEc781w";

webpush.setVapidDetails(
  "mailto:you@example.com",
  publicVapidKey,
  privateVapidKey
);

let db;
(async () => {
  db = await getDbConnection();
  console.log("✅ Connected to MySQL");
})();

app.use(express.static(path.join(__dirname, "client")));

app.post("/subscribe", async (req, res) => {
  const sub = req.body;
  const { endpoint, expirationTime, keys } = sub;

  try {
    await db.execute(
      `INSERT INTO push_subscriptions (endpoint, expirationTime, p256dh, auth)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE expirationTime=VALUES(expirationTime), p256dh=VALUES(p256dh), auth=VALUES(auth)`,
      [endpoint, expirationTime, keys.p256dh, keys.auth]
    );

    res.status(201).json({ message: "Subscription saved" });

    const payload = JSON.stringify({
      title: sub.title || "Subscribed!",
      body: sub.data || "First notification right after subscribing 🎉"
    });

    await webpush.sendNotification(sub, payload);
    console.log(`✅ First push sent to ${endpoint}`);
  } catch (err) {
    console.error("❌ Error saving subscription:", err);
    res.status(500).json({ error: "Failed to save subscription" });
  }
});

app.post("/send", async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM push_subscriptions`);

    if (rows.length === 0) {
      return res.status(400).json({ error: "No subscriptions saved" });
    }

    const payload = JSON.stringify({
      title: req.body.title || "Manual Push",
      body: req.body.data || "This was sent by calling /send 🚀"
    });

    await Promise.all(rows.map(async sub => {
      const subscription = {
        endpoint: sub.endpoint,
        expirationTime: sub.expirationTime,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      };

      return webpush.sendNotification(subscription, payload)
        .then(() => console.log(`✅ Push sent to ${sub.endpoint}`))
        .catch(async err => {
          console.error(`❌ Failed push to ${sub.endpoint}:`, err);

          if (err.statusCode === 410 || err.statusCode === 404) {
            await db.execute(`DELETE FROM push_subscriptions WHERE endpoint=?`, [sub.endpoint]);
            console.log(`🗑️ Removed expired subscription: ${sub.endpoint}`);
          }
        });
    }));

    res.status(200).json({ message: "Push sent to all subscribers" });
  } catch (err) {
    console.error("❌ Error sending pushes:", err);
    res.status(500).json({ error: "Failed to send pushes" });
  }
});

app.post("/send/:id", async (req, res) => {
  const subId = req.params.id;

  try {
    const [rows] = await db.execute(`SELECT id, endpoint, p256dh, auth, expirationTime FROM push_subscriptions WHERE id = ?`, [subId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const sub = rows[0];
    const subscription = {
      endpoint: sub.endpoint,
      expirationTime: sub.expirationTime,
      keys: { p256dh: sub.p256dh, auth: sub.auth },
    };

    const payload = JSON.stringify({
      title: req.body.title || "Personal Notification",
      body: req.body.data || `Sent only to subscription ID ${sub.id} 🚀`,
    });

    await webpush.sendNotification(subscription, payload);
    console.log(`✅ Push sent to subscription ID ${sub.id}`);
    res.status(200).json({ message: `Push sent to subscription ID ${sub.id}` });
  } catch (err) {
    console.error(`❌ Failed to send to subscription ID ${subId}:`, err);
    res.status(500).json({ error: "Failed to send push" });
  }
});
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
