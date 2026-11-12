import { Inject, Injectable } from "@nestjs/common";
import { type Emails, type EmailsSendOptions, MailChannels } from "@mailchannels/sdk";
import { MAILCHANNELS_CONFIGURATION_OPTIONS } from "./mailchannels.constant";
import type { MailChannelsDefaults, MailChannelsOptions } from "./mailchannels.interface";

type WithOptional<T, K extends keyof T> = T extends unknown
  ? Omit<T, K> & Partial<Pick<T, K>>
  : never;

export type MailChannelsEmailOptions = WithOptional<EmailsSendOptions, keyof MailChannelsDefaults>;

interface MailChannelsEmails extends Emails {
  send(options: MailChannelsEmailOptions, dryRun?: boolean): ReturnType<Emails["send"]>;
  queue(options: MailChannelsEmailOptions): ReturnType<Emails["queue"]>;
  sendAsync(options: MailChannelsEmailOptions): ReturnType<Emails["sendAsync"]>;
}

@Injectable()
export class MailChannelsService extends MailChannels {
  declare readonly emails: MailChannelsEmails;

  constructor(@Inject(MAILCHANNELS_CONFIGURATION_OPTIONS) options: MailChannelsOptions) {
    const { apiKey, defaults, ...clientOptions } = options;
    super(apiKey, clientOptions);

    const emails = this.emails;
    const send = emails.send.bind(emails);
    const queue = emails.queue.bind(emails);
    const withDefaults = (emailOptions: MailChannelsEmailOptions) => {
      const resolved = { ...defaults, ...emailOptions } as MailChannelsEmailOptions;

      if (
        emailOptions.personalizations !== undefined &&
        defaults?.to !== undefined &&
        emailOptions.to === undefined
      ) {
        delete resolved.to;
      }

      return resolved;
    };

    emails.send = (emailOptions, dryRun) => send(withDefaults(emailOptions), dryRun);
    emails.queue = (emailOptions) => queue(withDefaults(emailOptions));
    emails.sendAsync = (emailOptions) => queue(withDefaults(emailOptions));
  }
}
