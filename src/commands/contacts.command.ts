import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { phrases } from "../vocabulary";
import infoService from "../services/info/info.service";
export class ContactsCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle(): void {
    this.bot.action("contacts", async (ctx) => {
      const lang = ctx.session.language;
      const data = await infoService.getAllData();
      if (ctx.callbackQuery)
        ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      if (data)
        ctx.reply(
          `${phrases[lang].ourContacts}:\n\n${phrases[lang].phone}: ${data.phone}`,
          Markup.inlineKeyboard([
            [
              Markup.button.url(
                `${phrases[lang].telegram}`,
                `https://t.me/${data.telegram}`,
              ),
            ],
            [
              Markup.button.url(
                `${phrases[lang].site}`,
                `http://thebigexchange.net/`,
              ),
            ],
            [Markup.button.callback(`${phrases[lang].menu}`, `back_to_menu`)],
          ]),
        );
    });
    this.bot.command("contacts", async (ctx) => {
      const lang = ctx.session.language;
      const data = await infoService.getAllData();
      if (data)
        ctx.reply(
          `${phrases[lang].ourContacts}:\n\n${phrases[lang].phone}: ${data.phone}`,
          Markup.inlineKeyboard([
            [
              Markup.button.url(
                `${phrases[lang].telegram}`,
                `https://t.me/${data.telegram}`,
              ),
            ],
            [
              Markup.button.url(
                `${phrases[lang].site}`,
                `http://thebigexchange.net/`,
              ),
            ],
            [Markup.button.callback(`${phrases[lang].menu}`, `back_to_menu`)],
          ]),
        );
    });
  }
}
