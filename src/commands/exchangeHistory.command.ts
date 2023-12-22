import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import infoService from "../services/info/info.service";
import { phrases } from "../vocabulary";

export class HistoryCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle(): void {
    this.bot.action("history", async (ctx) => {
      ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      const lang = ctx.session.language;
      const list = await infoService.getRequestsByClientId(
        String(ctx.callbackQuery.from.id),
      );
      let message = `${phrases[lang].exchangeList}\n\n`;
      list.map((item) => {
        const status =
          item.status == "in_process"
            ? phrases[lang].inProcess
            : item.status == "completed"
            ? phrases[lang].completed
            : phrases[lang].canceled;
        message += `• ${item.giveSum}(${item.giveCurrency}) -> ${item.getSum}(${item.getCurrency}) [<b>${status}</b>]\n`;
      });
      ctx.replyWithHTML(
        message,
        Markup.inlineKeyboard([
          Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu"),
        ]),
      );
    });
    this.bot.command("history", async (ctx) => {
      ctx.deleteMessage(ctx.message.message_id);
      const lang = ctx.session.language;
      const list = await infoService.getRequestsByClientId(
        String(ctx.message.from.id),
      );
      let message = `${phrases[lang].exchangeList}\n\n`;
      list.map((item) => {
        const status =
          item.status == "in_process"
            ? phrases[lang].inProcess
            : item.status == "completed"
            ? phrases[lang].completed
            : phrases[lang].canceled;
        message += `• ${item.giveSum}(${item.giveCurrency}) -> ${item.getSum}(${item.getCurrency}) [<b>${status}</b>]\n`;
      });
      ctx.replyWithHTML(
        message,
        Markup.inlineKeyboard([
          Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu"),
        ]),
      );
    });
  }
}
