import "reflect-metadata";
import assert from "node:assert/strict";
import { test } from "node:test";
import { NestFactory } from "@nestjs/core";
import { MailChannels } from "@mailchannels/sdk";
import { MailChannelsModule, MailChannelsService } from "../dist/index.mjs";

test("ESM consumers can import named exports and start a Nest application", async (t) => {
  class AppModule {}
  const app = await NestFactory.createApplicationContext(
    {
      module: AppModule,
      imports: [MailChannelsModule.forRoot({ apiKey: "test-api-key" })]
    },
    {
      logger: false,
      abortOnError: false
    }
  );

  t.after(() => app.close());

  const service = app.get(MailChannelsService);
  assert.ok(service instanceof MailChannels);
});
