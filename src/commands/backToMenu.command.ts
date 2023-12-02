import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { Menu } from "./menu";

export class BackToMenuCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle(): void {
    this.bot.action("back_to_menu", (ctx) => {
      Menu(ctx);
    });
  }
}
