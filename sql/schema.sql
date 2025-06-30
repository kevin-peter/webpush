CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  endpoint VARCHAR(2048) NOT NULL,
  p256dh VARCHAR(255) NOT NULL,
  auth VARCHAR(255) NOT NULL,
  expirationTime BIGINT NULL,
  UNIQUE KEY endpoint_unique (endpoint(255))
);
