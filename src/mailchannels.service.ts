import { Inject, Injectable } from "@nestjs/common";
import { MailChannels } from "@mailchannels/sdk";

import { MAILCHANNELS_CONFIGURATION_OPTIONS } from "./mailchannels.constant";
import type { MailChannelsOptions } from "./mailchannels.interface";

@Injectable()
export class MailChannelsService extends MailChannels {
  constructor(@Inject(MAILCHANNELS_CONFIGURATION_OPTIONS) options: MailChannelsOptions) {
    super(options.apiKey, options);
  }
}
