# NestJS MailChannels

<!-- oxfmt-ignore-start -->
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
<!-- oxfmt-ignore-end -->

MailChannels Email API module integration for NestJS.

Leverages [`@mailchannels/sdk`](https://github.com/mailchannels/mailchannels-email-api-sdk-js)
package, the Official MailChannels Email API SDK for Node.js.

- [✨ Release Notes](CHANGELOG.md)
- [🏀 Online playground](https://stackblitz.com/github/mailchannels/nestjs-mailchannels?file=playground%2Fsrc%2Fapp.module.ts)

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Development](#development)

## Features

- All MailChannels Email API SDK features available

## Requirements

- NestJS 12 or higher
- MailChannels account and Email API key

## Installation

1. Add `nestjs-mailchannels` dependency to your project

```sh
# npm
$ npm install nestjs-mailchannels

# yarn
$ yarn add nestjs-mailchannels

# pnpm
$ pnpm add nestjs-mailchannels
```

## Usage

### Import the module

```ts
import { Module } from "@nestjs/common";
import { MailChannelsModule } from "nestjs-mailchannels";

@Module({
  imports: [
    MailChannelsModule.forRoot({
      apiKey: "YOUR-API-KEY",
      defaults: {
        from: "Name <from@example.com>"
      }
    })
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
```

`defaults` can configure `from`, `subject`, `to`, `headers`, and `dkim`. Configured values can be
omitted from individual calls, and values supplied on an individual message take precedence. When
using `personalizations`, recipients are specified per personalization, so a top-level default `to`
is not applied.

### Import the module Asynchronously

```ts
import { Module } from "@nestjs/common";
import { MailChannelsModule } from "nestjs-mailchannels";

@Module({
  imports: [
    MailChannelsModule.forRootAsync({
      useFactory: async () => ({
        apiKey: "YOUR-API-KEY"
      })
    })
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
```

### Controller for sending emails

```ts
import { Controller, HttpException, Post } from "@nestjs/common";
import { MailChannelsService } from "nestjs-mailchannels";

@Controller()
export class EmailsController {
  constructor(private readonly mailchannelsService: MailChannelsService) {}

  @Post("emails/send")
  async send() {
    const { data, error } = await this.mailchannelsService.emails.send({
      from: "Name <from@example.com>",
      to: "to@example.net",
      subject: "Test email",
      text: "Hello from NestJS",
      html: "<p>Hello from NestJS</p>"
    });

    if (error) {
      throw new HttpException(error.message, error.statusCode || 500);
    }

    return data;
  }

  @Post("emails/queue")
  async queue() {
    const { data, error } = await this.mailchannelsService.emails.queue({
      from: "Name <from@example.com>",
      to: "to@example.net",
      subject: "Test email",
      text: "Hello from NestJS",
      html: "<p>Hello from NestJS</p>"
    });

    if (error) {
      throw new HttpException(error.message, error.statusCode || 500);
    }

    return data;
  }
}
```

### Add your controller to your module

```ts
import { Module } from "@nestjs/common";
import { MailChannelsModule } from "nestjs-mailchannels";
import { EmailsController } from "./emails/emails.controller.js";

@Module({
  imports: [
    MailChannelsModule.forRoot({
      apiKey: "YOUR-API-KEY"
    })
  ],
  controllers: [EmailsController], // Add your controller here
  providers: [],
  exports: []
})
export class AppModule {}
```

## License

[MIT License](LICENSE)

## Development

<details>
  <summary>Local development</summary>

```sh
# Install dependencies
pnpm install

# Prepare environment
pnpm build

# Develop with the playground
pnpm playground:start

# Run Oxlint
pnpm lint

# Run Formatter
pnpm format

# Run Tests
pnpm test

# Run typecheck
pnpm test:types

# Release new version
pnpm release
```

</details>

<!-- oxfmt-ignore-start -->

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nestjs-mailchannels/latest.svg
[npm-version-href]: https://npmjs.com/package/nestjs-mailchannels

[npm-downloads-src]: https://img.shields.io/npm/dm/nestjs-mailchannels.svg
[npm-downloads-href]: https://npmjs.com/package/nestjs-mailchannels

[license-src]: https://img.shields.io/npm/l/nestjs-mailchannels.svg
[license-href]: LICENSE

<!-- oxfmt-ignore-end -->
