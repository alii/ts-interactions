import {
  APIInteraction,
  InteractionData,
  InteractionResponseType,
} from "../types";

import { Client, Guild, GuildMember, TextChannel } from "discord.js";
import { Webhook } from "discord-webhook-ts";
import { FollowUp } from "./FollowUp";
import { WithRequest } from "./WithRequest";

export class Interaction
  extends WithRequest
  implements Omit<APIInteraction, "member" | "guild_id" | "channel_id"> {
  public readonly options: Map<string, string>;

  channel: TextChannel | undefined;
  data: InteractionData;
  guild: Guild | undefined;
  id: string;
  member: GuildMember | undefined;
  token: string;
  type: number;

  constructor(client: Client, public readonly _data: APIInteraction) {
    super(client);

    this.options = new Map(
      (_data.data.options ?? []).map((option) => {
        return [option.name, option.value] as [string, string];
      })
    );

    this.channel = this.client.channels.cache.get(this._data.channel_id) as
      | TextChannel
      | undefined;

    this.type = this._data.type;
    this.data = this._data.data;
    this.id = this._data.id;
    this.token = this._data.token;
    this.guild = this.client.guilds.cache.get(this._data.guild_id);

    this.member = this.guild?.members.cache.get(
      this._data.member.user.id.toString()
    );
  }

  async reply(
    content: Webhook.input.POST | string,
    type: InteractionResponseType = InteractionResponseType.ChannelMessageWithSource
  ) {
    const url = `https://discord.com/api/interactions/${this._data.id}/${this._data.token}/callback`;

    const data = typeof content === "string" ? { content } : content;

    await this.fetch(url, {
      body: JSON.stringify({ type, data }),
      method: "POST",
    });

    return new InteractionReply(this);
  }

  createFollowup = (content: Webhook.input.POST | string) => {
    const url = `https://discord.com/api/webhooks/${this.client.user?.id}/${this.token}`;

    return this.fetch(url, {
      body: JSON.stringify(typeof content === "string" ? { content } : content),
      method: "POST",
    })
      .then((res) => res.json())
      .then((d) => new FollowUp(this, d));
  };
}

export class InteractionReply extends WithRequest {
  constructor(private readonly interaction: Interaction) {
    super(interaction.client);
  }

  edit(
    content: Webhook.input.PATCH | string,
    type: InteractionResponseType = InteractionResponseType.ChannelMessageWithSource
  ) {
    const data = typeof content === "string" ? { content } : content;

    return this.fetch(
      `https://discord.com/api/webhooks/${this.client.user?.id}/${this.interaction.token}/messages/@original`,
      {
        method: "PATCH",
        body: JSON.stringify({ type, data }),
      }
    );
  }

  delete() {
    return this.fetch(
      `https://discord.com/api/webhooks/${this.client.user?.id}/${this.interaction.token}/messages/@original`,
      {
        method: "DELETE",
      }
    );
  }
}
