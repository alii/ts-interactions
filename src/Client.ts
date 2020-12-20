import { Client as DiscordClient, ClientOptions } from "discord.js";

export class Client extends DiscordClient {
  constructor(token: string, options?: ClientOptions) {
    super(options);
    this.login(token);
  }
}
