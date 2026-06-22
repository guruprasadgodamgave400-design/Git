require("dotenv").config();
const createApp = require("./app");
const connectDB = require("./config/db");

const PORT = Number(process.env.PORT) || 5000;

async function bootstrap() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("[server] MONGO_URI is not set");
    process.exit(1);
  }
  await connectDB(uri);

  const app = createApp();
  const server = app.listen(PORT, () => {
    console.log(`[server] Aurelia API listening on http://localhost:${PORT}`);
  });

  const shutdown = (signal) => () => {
    console.log(`\n[server] ${signal} received, closing...`);
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown("SIGINT"));
  process.on("SIGTERM", shutdown("SIGTERM"));
}

bootstrap().catch((err) => {
  console.error("[server] Fatal startup error:", err);
  process.exit(1);
});