import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { Menu } from "./menu";
import { store } from "../store/store";

export class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle(): void {
    this.bot.start(async (ctx) => {
      Menu(ctx, false);
    });
  }
}
