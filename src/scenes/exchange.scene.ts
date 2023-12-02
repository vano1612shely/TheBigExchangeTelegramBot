import { Markup, Scenes } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { phrases } from "../vocabulary";
const { enter, leave } = Scenes.Stage;
export const exchangeScene = new Scenes.BaseScene<IBotContext>("exchange");
exchangeScene.enter((ctx) => {
  const lang = ctx.session.language;
  ctx.reply(
    "Select type: ",
    Markup.inlineKeyboard([
      [Markup.button.callback(`🇺🇦 Українська`, "lang:ua")],
      [Markup.button.callback(`🇺🇸 English`, "lang:en")],
      [Markup.button.callback(`🇷🇺 Русский`, "lang:ru")],
      [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
    ]),
  );
});
exchangeScene.command("back", leave<IBotContext>());
