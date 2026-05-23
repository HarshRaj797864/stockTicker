import Redis from "ioredis";

const url = process.env.REDIS_URL || "redis://localhost:6379";

let publisher;
export function getPublisher() {
  if (!publisher) {
    publisher = new Redis(url, { maxRetriesPerRequest: null });
    publisher.on("error", (err) => console.error("[redis-publisher]", err.message));
  }
  return publisher;
}

let subscriber;
export function getSubscriber() {
  if (!subscriber) {
    subscriber = new Redis(url, { maxRetriesPerRequest: null });
    subscriber.on("error", (err) => console.error("[redis-subscriber]", err.message));
  }
  return subscriber;
}

export const channels = {
  price: (symbol) => `market:prices:${symbol}`,
  pricePattern: "market:prices:*",
};
