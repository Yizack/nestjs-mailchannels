import type { FactoryProvider, ModuleMetadata } from "@nestjs/common";
import type { EmailsSendOptions, MailChannelsClientOptions } from "@mailchannels/sdk";

export type MailChannelsDefaults = Pick<
  EmailsSendOptions,
  "from" | "subject" | "to" | "headers" | "dkim"
>;

export interface MailChannelsOptions extends MailChannelsClientOptions {
  apiKey: string;
  defaults?: Partial<MailChannelsDefaults>;
}

export interface MailChannelsOptionsAsync extends Pick<ModuleMetadata, "imports"> {
  name?: string;
  useFactory: (...args: unknown[]) => MailChannelsOptions | Promise<MailChannelsOptions>;
  inject?: FactoryProvider<MailChannelsOptions>["inject"];
}
