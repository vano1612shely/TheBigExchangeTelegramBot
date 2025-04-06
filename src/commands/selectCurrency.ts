import { Markup } from "telegraf";
import currencyService from "../services/currency/currency.service";
import { ICurrency } from "../services/currency/currency-service.interface";
import { phrases } from "../vocabulary";

export async function SelectCurrency(ctx, type: "crypto" | "fiat") {
  let currencyList: ICurrency[] = [];
  if (type === "crypto") {
    currencyList = await currencyService.getCrypto();
  } else {
    currencyList = await currencyService.getFiat();
  }
  const allList = await currencyService.getAll();
  ctx.session.exchangeState.currencyList = allList;
  const chunks = [];
  const chunkSize = 2;

  for (let i = 0; i < currencyList.length; i += chunkSize) {
    chunks.push(currencyList.slice(i, i + chunkSize));
  }

  const lang = ctx.session.language;
  const buttons = chunks.map((chunk) =>
    chunk.map((currency) =>
      Markup.button.callback(currency.title, `selectCurrency:${currency.value}`)
    )
  );
  if (ctx.session.exchangeProp.giveCurrency == null) {
    ctx.reply(
      `${phrases[lang].chooseGiveCurrency}`,
      Markup.inlineKeyboard([
        ...buttons,
        [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
      ])
    );
  } else {
    ctx.reply(
      `${phrases[lang].chooseGetCurrency}`,
      Markup.inlineKeyboard([
        ...buttons,
        [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
      ])
    );
  }
}
