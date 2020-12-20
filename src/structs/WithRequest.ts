import { Base, Client } from "discord.js";
import fetch, { RequestInit } from "node-fetch";

export class WithRequest extends Base {
  constructor(client: Client) {
    super(client);
  }

  async fetch(url: string, init?: RequestInit) {
    const Authorization = `Bot ${this.client.token}`;

    const headers = init?.body
      ? {
          ...init?.headers,
          Authorization,
          "Content-Type": "application/json",
        }
      : { ...init?.headers, Authorization };

    return fetch(url, {
      ...init,
      headers,
    });
  }
}
