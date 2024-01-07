import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { phrases } from "../vocabulary";

export class DepositCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle(): void {
    this.bot.command("deposit", async (ctx) => {
      if (!ctx.session || !ctx.session.language) {
        ctx.session.language = "en";
      }
      ctx.deleteMessage(ctx.message?.message_id);
      const lang = ctx.session.language;
      ctx.reply(
        ``,
        Markup.inlineKeyboard([
          [
            Markup.button.url(
              `${phrases[lang].goldDeposit}`,
              "https://t.me/TheBig_gold",
            ),
          ],
          [
            Markup.button.url(
              `${phrases[lang].dollarDeposit}`,
              "https://t.me/Thebig_deposit",
            ),
          ],
          [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
        ]),
      );
    });
    this.bot.action("deposit", async (ctx) => {
      if (!ctx.session || !ctx.session.language) {
        ctx.session.language = "en";
      }
      ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      const lang = ctx.session.language;
      ctx.sendMessage(
        phrases[lang].moreInfo + ":",
        Markup.inlineKeyboard([
          [
            Markup.button.url(
              `${phrases[lang].goldDeposit}`,
              "https://t.me/TheBig_gold",
            ),
          ],
          [
            Markup.button.url(
              `${phrases[lang].dollarDeposit}`,
              "https://t.me/Thebig_deposit",
            ),
          ],
          [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
        ]),
      );
    });
  }
}
