import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { ConfigService } from "../config/config.service";

export class StatusCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle(): void {
    this.bot.command("setStatus", async (ctx) => {
      if (ctx.chat.id.toString() !== new ConfigService().get("CHAT_ID")) {
        return;
      }
      ctx.scene.enter("status");
    });
  }
}
