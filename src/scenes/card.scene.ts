import { Scenes } from "telegraf";
import { IBotContext } from "../context/context.interface";
import complete from "../commands/complete.request";
import { phrases } from "../vocabulary";

export const cardScene = new Scenes.BaseScene<IBotContext>("card");

cardScene.enter(async (ctx) => {
  const lang = ctx.session.language;
  if (ctx.session.exchangeProp.getCurrency?.type == "fiat") {
    ctx.reply(`${phrases[lang].enterCardNumber}`);
  } else {
    ctx.reply(`${phrases[lang].enterCryptoWallet}`);
  }
});

cardScene.on("text", async (ctx) => {
  const number = ctx.message.text;
  ctx.scene.leave();
  ctx.session.exchangeProp.wallet = number;
  complete(ctx);
});
