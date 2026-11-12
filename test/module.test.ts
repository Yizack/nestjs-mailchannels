import { expect, it, vi } from "vitest";
import { NestFactory } from "@nestjs/core";
import { MailChannels } from "@mailchannels/sdk";
import { MailChannelsModule, MailChannelsService } from "../dist/index.mjs";

it("ESM consumers can import named exports and start a Nest application", async () => {
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

  const service = app.get(MailChannelsService);
  expect(service).toBeInstanceOf(MailChannels);

  await app.close();
});

it("email defaults apply to send, queue, and sendAsync unless overridden", async () => {
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

  const fetchMock = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(new Response())
    .mockResolvedValueOnce(new Response())
    .mockResolvedValueOnce(new Response())
    .mockResolvedValueOnce(new Response());

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

  const requests = fetchMock.mock.calls.map(([input, init]) => ({
    path: new URL(String(input)).pathname,
    body: String(init?.body)
  }));

  fetchMock.mockRestore();

  expect(requests).toHaveLength(4);

  expect(requests[0].path).toBe("/tx/v1/send");
  expect(requests[0].body).toMatch(/default@example\.com/);
  expect(requests[0].body).toMatch(/default-to@example\.com/);
  expect(requests[0].body).toMatch(/Default subject/);
  expect(requests[0].body).toMatch(/X-Default/);

  expect(requests[1].path).toBe("/tx/v1/send-async");
  expect(requests[1].body).toMatch(/override@example\.com/);
  expect(requests[1].body).toMatch(/override-to@example\.com/);
  expect(requests[1].body).toMatch(/Queue/);
  expect(requests[1].body).not.toMatch(/default@example\.com/);
  expect(requests[1].body).not.toMatch(/default-to@example\.com/);
  expect(requests[1].body).not.toMatch(/Default subject/);

  expect(requests[2].path).toBe("/tx/v1/send-async");
  expect(requests[2].body).toMatch(/default@example\.com/);
  expect(requests[2].body).toMatch(/default-to@example\.com/);
  expect(requests[2].body).toMatch(/Default subject/);

  expect(requests[3].path).toBe("/tx/v1/send");
  expect(requests[3].body).toMatch(/personal@example\.com/);
  expect(requests[3].body).not.toMatch(/default-to@example\.com/);
});
