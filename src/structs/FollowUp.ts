import { APIWebhookResponse } from "../types";
import { Webhook } from "discord-webhook-ts";
import { Interaction } from "./Interaction";
import { WithRequest } from "./WithRequest";

export class FollowUp extends WithRequest {
  constructor(
    public readonly interaction: Interaction,
    public readonly _data: APIWebhookResponse
  ) {
    super(interaction.client);
  }

  async edit(newContent: Webhook.input.PATCH | string) {
    const url = `https://discord.com/api/webhooks/${this.client.user?.id}/${this.interaction.token}/messages/${this._data.id}`;

    return this.fetch(url, {
      method: "PATCH",
      body: JSON.stringify(newContent),
    });
  }

  async delete() {
    throw new Error("Method has not been implemented");
  }
}
