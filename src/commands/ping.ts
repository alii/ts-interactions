import { Command } from "../types";
import { Interaction } from "../structs/Interaction";

export const ping: Command = {
  description: "Plays table tennis with you",
  name: "ping",
  options: [],
  async execute(interaction: Interaction) {
    await interaction.reply("Pong");
  },
};
