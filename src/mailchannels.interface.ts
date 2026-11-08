import type { FactoryProvider, ModuleMetadata } from "@nestjs/common";
import type { MailChannelsClientOptions } from "@mailchannels/sdk";

export interface MailChannelsOptions extends MailChannelsClientOptions {
  apiKey: string;
}

export interface MailChannelsOptionsAsync extends Pick<ModuleMetadata, "imports"> {
  name?: string;
  useFactory: (...args: unknown[]) => MailChannelsOptions | Promise<MailChannelsOptions>;
  inject?: FactoryProvider<MailChannelsOptions>["inject"];
}
