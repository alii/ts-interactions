import "dotenv/config";
import signale from "signale";
import { env } from "./env";
import { ping } from "./commands/ping";
import { Client } from "./Client";

const client = new Client([ping], {
  onError: signale.error,
});

client.on("ready", () => {
  signale.success("[DISCORD] Ready");
});

client.login(env.DISCORD_TOKEN);
