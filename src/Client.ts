import { Client as DiscordClient, ClientOptions } from "discord.js";
import { Command } from "./types";
import { Interaction } from "./structs/Interaction";

type WithError<T> = T & {
  onError?: (e: Error, interaction: Interaction) => unknown;
};

export class Client extends DiscordClient {
  private commandMap: Map<Command["name"], Command>;
  private readonly onError: (e: Error, interaction: Interaction) => unknown;

  constructor(commands: Command[], options?: WithError<ClientOptions>) {
    super(options);

    const entries = commands.map((command) => {
      return [command.name, command] as [string, Command];
    });

    this.onError = options?.onError || console.error;
    this.commandMap = new Map(entries);

    this.on("raw", async (packet) => {
      if (packet.t !== "INTERACTION_CREATE") return;
      const interaction = new Interaction(this, packet.d);
      await this.handleInteraction(interaction);
    });
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
}
