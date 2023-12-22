import { Markup, Scenes } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { phrases } from "../vocabulary";
import api from "../services/api/http";
import { Menu } from "../commands/menu";
import complete from "../commands/complete.request";
import { chain } from "../commands/chain.command";
import { bank } from "../commands/bank.command";
export const exchangeScene = new Scenes.BaseScene<IBotContext>("exchange");
exchangeScene.enter(async (ctx) => {
  const lang = ctx.session.language;
  const res = await api.get("/price", {
    params: {
      giveCurrency: ctx.session.exchangeProp.giveCurrency,
      getCurrency: ctx.session.exchangeProp.getCurrency,
    },
  });
  ctx.session.exchangeProp.exchange = res.data.price;
  ctx.reply(
    `${phrases[lang].youWantExchange} ${ctx.session.exchangeProp.giveCurrency?.title} ${phrases[lang].for} ${ctx.session.exchangeProp.getCurrency?.title}\n ${phrases[lang].exchangeRate} 1${ctx.session.exchangeProp.giveCurrency?.value} = ${ctx.session.exchangeProp.exchange}${ctx.session.exchangeProp.getCurrency?.value}`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `${phrases[lang].wantGive} ${ctx.session.exchangeProp.giveCurrency?.title}`,
          `setGiveSum`,
        ),
      ],
      [
        Markup.button.callback(
          `${phrases[lang].wantGet} ${ctx.session.exchangeProp.getCurrency?.title}`,
          `setGetSum`,
        ),
      ],
      [Markup.button.callback(`${phrases[lang].back}`, "back")],
    ]),
  );
});
exchangeScene.action("setGiveSum", async (ctx) => {
  const lang = ctx.session.language;
  ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
  ctx.reply(
    `${phrases[lang].enterGiveAmount}(${ctx.session.exchangeProp.giveCurrency?.value}):`,
    Markup.inlineKeyboard([
      Markup.button.callback(`${phrases[lang].back}`, "back"),
    ]),
  );
  ctx.scene.state = { ...ctx.scene.state, sumType: "give" };
});

exchangeScene.action("setGetSum", async (ctx) => {
  const lang = ctx.session.language;
  ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
  ctx.reply(
    `${phrases[lang].enterGetAmount}(${ctx.session.exchangeProp.getCurrency?.value}):`,
    Markup.inlineKeyboard([
      Markup.button.callback(`${phrases[lang].back}`, "back"),
    ]),
  );
  ctx.scene.state = { ...ctx.scene.state, sumType: "get" };
});
exchangeScene.on("text", async (ctx) => {
  const sum = Number(ctx.message.text);
  const lang = ctx.session.language;
  const res = await api.get("/price", {
    params: {
      giveCurrency: ctx.session.exchangeProp.giveCurrency,
      getCurrency: ctx.session.exchangeProp.getCurrency,
    },
  });
  if (!isNaN(sum)) {
    if (ctx.scene.state && ctx.scene.state.sumType) {
      if (ctx.scene.state.sumType === "give") {
        ctx.scene.leave();
        ctx.session.exchangeProp.giveSum = sum;
        ctx.session.exchangeProp.getSum = sum * res.data.price;
        ctx.session.exchangeProp.exchange = res.data.price;
      } else {
        ctx.scene.leave();
        ctx.session.exchangeProp.getSum = sum;
        ctx.session.exchangeProp.giveSum = sum / res.data.price;
        ctx.session.exchangeProp.exchange = res.data.price;
      }
      if (
        ctx.session.exchangeProp.type == "online" ||
        (ctx.session.exchangeProp.type == "transaction" &&
          ctx.session.exchangeProp.transactionType == "online")
      ) {
        if (ctx.session.exchangeProp.getCurrency?.type == "crypto")
          await chain(ctx);
        else if (ctx.session.exchangeProp.getCurrency?.type == "fiat")
          await bank(ctx);
        else ctx.scene.enter("card");
      } else {
        complete(ctx);
      }
    }
  } else {
    ctx.reply(`${phrases[lang].correctAmountError}`);
  }
});
exchangeScene.action("back", (ctx) => {
  ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
  ctx.scene.leave();
  Menu(ctx);
});
