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

test("email defaults apply to send, queue, and sendAsync unless overridden", async () => {
  const service = new MailChannelsService({
    apiKey: "test-api-key",
    baseUrl: "https://mailchannels.test",
    defaults: {
      from: "default@example.com",
      subject: "Default subject",
      to: "default-to@example.com",
      headers: { "X-Default": "configured" }
    }
  });
  const requests: { url: string; body: string }[] = [];
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (input, init) => {
    requests.push({ url: String(input), body: String(init?.body) });
    return new Response(
      JSON.stringify({ data: {}, queued_at: "2026-01-01T00:00:00Z", request_id: "test" }),
      { headers: { "content-type": "application/json" } }
    );
  };

  try {
    await service.emails.send({ text: "Hello" });
    await service.emails.queue({
      from: "override@example.com",
      to: "override-to@example.com",
      subject: "Queue",
      text: "Hello"
    });
    await service.emails.sendAsync({ text: "Hello" });
    await service.emails.send({
      personalizations: [{ to: "personal@example.com" }],
      subject: "Personalization",
      text: "Hello"
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(requests.length, 4);
  assert.match(requests[0].body, /default@example\.com/);
  assert.match(requests[0].body, /default-to@example\.com/);
  assert.match(requests[0].body, /Default subject/);
  assert.match(requests[0].body, /X-Default/);
  assert.match(requests[1].body, /override@example\.com/);
  assert.match(requests[1].body, /override-to@example\.com/);
  assert.match(requests[1].body, /Queue/);
  assert.doesNotMatch(requests[1].body, /default@example\.com/);
  assert.doesNotMatch(requests[1].body, /default-to@example\.com/);
  assert.doesNotMatch(requests[1].body, /Default subject/);
  assert.match(requests[2].body, /default@example\.com/);
  assert.match(requests[2].body, /default-to@example\.com/);
  assert.match(requests[2].body, /Default subject/);
  assert.match(requests[3].body, /personal@example\.com/);
  assert.doesNotMatch(requests[3].body, /default-to@example\.com/);
  assert.equal(new URL(requests[0].url).pathname, "/tx/v1/send");
  assert.equal(new URL(requests[1].url).pathname, "/tx/v1/send-async");
  assert.equal(new URL(requests[2].url).pathname, "/tx/v1/send-async");
  assert.equal(new URL(requests[3].url).pathname, "/tx/v1/send");
});
