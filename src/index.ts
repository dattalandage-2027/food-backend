import { createApp } from "./app";
import { closeDatabase, createDefaultStore } from "./store";

const store = await createDefaultStore();
const app = createApp(store);
const port = Number(process.env.PORT ?? 3000);

const server = Bun.serve({ port, fetch: app.fetch });
console.log(`Food backend listening on http://localhost:${server.port}`);

const shutdown = async () => {
  server.stop();
  await closeDatabase();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
