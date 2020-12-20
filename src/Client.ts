import {
  Client as DiscordClient,
  ClientOptions as DiscordClientOptions,
} from "discord.js";

import { Command } from "./types";
import { Interaction } from "./structs/Interaction";
import fetch, { RequestInit } from "node-fetch";

type ClientOptions = DiscordClientOptions & {
  onError?: (e: Error, interaction: Interaction) => unknown;
  /** The Guild to test commands in, so that you don't have to wait a full hour for the cache to invalidate */
  testGuildId: string;
};

export class Client extends DiscordClient {
  private commandMap: Map<Command["name"], Command>;
  private readonly onError: (e: Error, interaction: Interaction) => unknown;
  public readonly testGuildId: string;

  constructor(commands: Command[], options: ClientOptions) {
    super(options);

    const entries = commands.map((command) => {
      return [command.name, command] as [string, Command];
    });

    this.testGuildId = options.testGuildId;
    this.onError = options?.onError || console.error;
    this.commandMap = new Map(entries);

    this.on("raw", async (packet) => {
      if (packet.t !== "INTERACTION_CREATE") return;
      const interaction = new Interaction(this, packet.d);
      await this.handleInteraction(interaction);
    });
  }

  private async registerCommands() {
    const commands = [...this.commandMap.values()];

    for (const { execute, ...command } of commands) {
      const endpoints = [
        `applications/${this.user?.id}/guilds/${this.testGuildId}/commands`,
        `applications/${this.user?.id}/commands`,
      ].map((x) => `https://discord.com/api/${x}`);

      const init: RequestInit = {
        headers: {
          "Authorization": `Bot ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
        method: "POST",
      };

      for (const endpoint of endpoints) {
        await fetch(endpoint, init);
      }
    }
  }

  private async handleInteraction(interaction: Interaction) {
    const command = this.commandMap.get(interaction.data.name);

    // Chances are the cache is outdated, but this is mostly here to make TS happy :D
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (e) {
      this.onError(e, interaction);
    }
  }

  async login(token: string) {
    const loginResult = await super.login(token);
    await this.registerCommands();
    return loginResult;
  }
}
