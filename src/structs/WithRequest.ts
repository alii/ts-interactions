import { Base, Client } from "discord.js";
import fetch, { RequestInit } from "node-fetch";

export abstract class WithRequest extends Base {
  protected constructor(client: Client) {
    super(client);
  }

  protected async fetch(endpoint: string, init?: RequestInit) {
    const Authorization = `Bot ${this.client.token}`;

    const headers = init?.body
      ? {
          ...init?.headers,
          Authorization,
          "Content-Type": "application/json",
        }
      : { ...init?.headers, Authorization };

    return fetch(`https://discord.com/api${endpoint}`, {
      ...init,
      headers,
    });
  }
}
