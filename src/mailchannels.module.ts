import { Module } from "@nestjs/common";
import type { DynamicModule } from "@nestjs/common";

import { MAILCHANNELS_CONFIGURATION_OPTIONS } from "./mailchannels.constant";
import type { MailChannelsOptions, MailChannelsOptionsAsync } from "./mailchannels.interface";
import { MailChannelsService } from "./mailchannels.service";

@Module({
  providers: [MailChannelsService],
  exports: [MailChannelsService]
})
export class MailChannelsModule {
  static forRoot(options: MailChannelsOptions): DynamicModule {
    const mailchannelsModuleOptions = {
      provide: MAILCHANNELS_CONFIGURATION_OPTIONS,
      useValue: options
    };

    return {
      module: MailChannelsModule,
      providers: [mailchannelsModuleOptions],
      exports: [MailChannelsService]
    };
  }

  static forRootAsync(options: MailChannelsOptionsAsync): DynamicModule {
    const mailchannelsModuleOptions = {
      provide: MAILCHANNELS_CONFIGURATION_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || []
    };

    return {
      module: MailChannelsModule,
      imports: options.imports,
      providers: [mailchannelsModuleOptions],
      exports: [MailChannelsService]
    };
  }
}
