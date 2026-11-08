import { Module } from "@nestjs/common";
import { MailChannelsModule } from "../../dist/index.mjs";
import { EmailsController } from "./emails/emails.controller.js";

@Module({
  imports: [
    MailChannelsModule.forRoot({
      apiKey: "YOUR-API-KEY"
    })
  ],
  controllers: [EmailsController],
  providers: [],
  exports: []
})
export class AppModule {}
