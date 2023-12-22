import { Markup } from "telegraf";
import currencyService from "../services/currency/currency.service";
import { IBotContext } from "../context/context.interface";
import { ICurrency } from "../services/currency/currency-service.interface";
import { phrases } from "../vocabulary";

export function SelectTypeCurrency(ctx: IBotContext) {
  const exchangeType = ctx.session.exchangeState.type;
  const lang = ctx.session.language;
  if (exchangeType !== "transaction") {
    ctx.reply(
      `${phrases[lang].chooseGiveCurrencyType}`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Crypto", "getCyrrencyType:crypto"),
          Markup.button.callback("Fiat", "getCyrrencyType:fiat"),
        ],
        [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
      ]),
    );
  } else {
    return SelectCurrency(ctx, "fiat");
  }
}

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
      Markup.button.callback(
        currency.title,
        `selectCurrency:${currency.value}`,
      ),
    ),
  );
  if (ctx.session.exchangeProp.giveCurrency == null) {
    ctx.reply(
      `${phrases[lang].chooseGiveCurrency}`,
      Markup.inlineKeyboard([
        ...buttons,
        [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
      ]),
    );
  } else {
    ctx.reply(
      `${phrases[lang].chooseGetCurrency}`,
      Markup.inlineKeyboard([
        ...buttons,
        [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
      ]),
    );
  }
}
