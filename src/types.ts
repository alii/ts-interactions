import { Interaction } from "./structs/Interaction";

export type CommandOption = {
  type: ApplicationCommandOptionType;
  name: string;
  description: string;
  default?: boolean;
  required?: boolean;
  choices?: CommandOptionChoice[];
  options?: CommandOption[];
};

export type CommandOptionChoice = {
  name: string;
  value: string | number;
};

export type Command = {
  name: string;
  description: string;
  options: CommandOption[];
  execute(interaction: Interaction): Promise<unknown>;
};

export enum ApplicationCommandOptionType {
  __placeholder,
  SUB_COMMAND,
  SUB_COMMAND_GROUP,
  STRING,
  BOOLEAN,
  USER,
  CHANNEL,
  ROLE,
}

export interface APIInteraction {
  type: number;
  token: string;
  member: InteractionMember;
  id: string;
  guild_id: string;
  data: InteractionData;
  channel_id: string;
}

export interface InteractionMember {
  user: InteractionMemberUser;
  roles: string[];
  premium_since: string | null;
  permissions: string;
  pending: boolean;
  nick: string | null;
  mute: boolean;
  joined_at: string;
  is_pending: boolean;
  deaf: boolean;
}

export interface InteractionMemberUser {
  id: string | number;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
}

export interface InteractionData {
  options?: InteractionOption[];
  name: string;
  id: string;
}

export interface InteractionOption {
  name: string;
  value: string;
}

export interface APIWebhookResponse {
  id: string;
  type: number;
  content: string;
  channel_id: string;
  author: Author;
  attachments: string[];
  embeds: Embed[];
  mentions: unknown[];
  mention_roles: string[];
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
  timestamp: string;
  edited_timestamp: string;
  flags: number;
  webhook_id: string;
}

export interface Author {
  bot: boolean;
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
}

export interface Embed {
  type: string;
  title: string;
  description: string;
  color: number;
  fields?: Field[];
}

export interface Field {
  name: string;
  value: string;
  inline: boolean;
}

export enum InteractionResponseType {
  __placeholder,
  /**
   * ACK a Ping
   */
  Pong,
  /**
   * ACK a command without sending a message, eating the user's input
   */
  Ack,
  /**
   * respond with a message, eating the user's input
   */
  ChannelMessage,
  /**
   * respond with a message, showing the user's input
   */
  ChannelMessageWithSource,
  /**
   * ACK a command without sending a message, showing the user's input
   */
  AckWithSource,
}
