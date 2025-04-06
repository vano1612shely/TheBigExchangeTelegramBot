import { phrases } from "../vocabulary";
import { Markup } from "telegraf";

export async function selectCurrencyType(ctx, type: "give" | "get") {
  const lang = ctx.session.language;
  await ctx.reply(
    type === "give"
      ? `${phrases[lang].selectGiveType}`
      : `${phrases[lang].selectGetType}`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          type === "give"
            ? `${phrases[lang].exchengeGiveType1}`
            : `${phrases[lang].exchengeGetType1}`,
          "exchangeGiveType:cashless"
        ),
      ],
      [
        Markup.button.callback(
          type === "give"
            ? `${phrases[lang].exchengeGiveType2}`
            : `${phrases[lang].exchengeGetType2}`,
          "exchangeGiveType:cash"
        ),
      ],
      [
        Markup.button.callback(
          type === "give"
            ? `${phrases[lang].exchengeGiveType3}`
            : `${phrases[lang].exchengeGetType3}`,
          "exchangeGiveType:crypto"
        ),
      ],
      [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
    ])
  );
}
