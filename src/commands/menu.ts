import { Markup } from "telegraf";
import { phrases } from "../vocabulary";
import { IBotContext } from "../context/context.interface";

export function Menu(ctx: IBotContext) {
  if (!ctx.session || !ctx.session.language) {
    ctx.session.language = "en";
  }
  ctx.deleteMessage(
    ctx.callbackQuery
      ? ctx.callbackQuery.message?.message_id
      : ctx.message?.message_id,
  );
  const lang = ctx.session.language;
  ctx.reply(
    `${phrases[lang].welcome}\n${phrases[lang].selectAction}`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`${phrases[lang].exchange}`, "exchange")],
      [Markup.button.callback(`${phrases[lang].history}`, "history")],
      [Markup.button.callback(`${phrases[lang].contacts}`, "contacts")],
      [Markup.button.callback(`${phrases[lang].changeLanguage}`, "language")],
    ]),
  );
}
