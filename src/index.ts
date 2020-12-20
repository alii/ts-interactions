import "dotenv/config";
import { Client } from "./Client";
import { env } from "./env";
import signale from "signale";

const client = new Client(env.DISCORD_TOKEN);

client.on("ready", () => {
  signale.success("[DISCORD] Ready");
});
