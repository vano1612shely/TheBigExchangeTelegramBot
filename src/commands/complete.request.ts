import { Markup } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { phrases } from "../vocabulary";

export default async function complete(ctx: IBotContext) {
  const lang = ctx.session.language;
  let message = "";
  message += `${phrases[lang].name}: <b>${ctx.message.from.first_name}</b>\n`;
  message += `Telegram: <b>@${ctx.message.from.username}</b>\n`;
  message += `${
    ctx.session.exchangeProp.city
      ? phrases[lang].city + ": " + ctx.session.exchangeProp.city + "\n\n"
      : ""
  }`;
  message += `${phrases[lang].give}: <b>${ctx.session.exchangeProp.giveCurrency?.title}(${ctx.session.exchangeProp.giveSum})</b>\n`;
  message += `${phrases[lang].receive}: <b>${ctx.session.exchangeProp.getCurrency?.title}(${ctx.session.exchangeProp.getSum})</b>\n`;
  message += `${phrases[lang].approximateExchangeRate}: <b>${ctx.session.exchangeProp.exchange}</b>\n\n`;
  if (ctx.session.exchangeProp.wallet)
    message += `${phrases[lang].wallet}: <b>${ctx.session.exchangeProp.wallet}</b>\n\n`;
  message += `<b>${phrases[lang].submit}?</b>`;
  ctx.replyWithHTML(
    message,
    Markup.inlineKeyboard([
      [Markup.button.callback(`${phrases[lang].submit}`, "sendMessage")],
      [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
    ])
  );
}
