import { app } from "./app/app.js";
import { env } from "./env.js";

const start = async () => {
  try {
    await app.listen({ port: env.PORT });
    console.log(`Server running on port ${env.PORT} 🔥`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
