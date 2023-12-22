import { Telegraf, Markup } from "telegraf";
import { AllowedLanguage, IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { phrases } from "../vocabulary";
import { Menu } from "./menu";
export class LanguageCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle(): void {
    this.bot.action("language", (ctx) => {
      ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      if (!ctx || !ctx.session.language) {
        ctx.session.language = "en";
      }
      const lang = ctx.session.language;
      ctx.reply(
        `${phrases[lang].chooseLanguage}`,
        Markup.inlineKeyboard([
          [Markup.button.callback(`🇺🇦 Українська`, "lang:ua")],
          [Markup.button.callback(`🇺🇸 English`, "lang:en")],
          [Markup.button.callback(`🇷🇺 Русский`, "lang:ru")],
          [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
        ]),
      );
    });
    this.bot.command("language", (ctx) => {
      if (!ctx || !ctx.session.language) {
        ctx.session.language = "en";
      }
      const lang = ctx.session.language;
      ctx.reply(
        `${phrases[lang].chooseLanguage}`,
        Markup.inlineKeyboard([
          [Markup.button.callback(`🇺🇦 Українська`, "lang:ua")],
          [Markup.button.callback(`🇺🇸 English`, "lang:en")],
          [Markup.button.callback(`🇷🇺 Русский`, "lang:ru")],
          [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
        ]),
      );
    });
    this.bot.action(/^lang:(\w{2})$/, (ctx) => {
      const lang = ctx.match[1]; // Extract language code from callback data
      if (ctx.session) {
        ctx.session.language = lang as AllowedLanguage; // Set the selected language to ctx.session.language
      }
      // Handle further actions or replies based on the selected language if needed
      // For example, you can reply with a confirmation message or perform additional logic
      // ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      Menu(ctx);
      // Additional logic can go here based on the selected language
    });
  }
}
