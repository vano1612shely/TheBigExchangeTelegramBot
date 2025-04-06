import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { phrases } from "../vocabulary";
import { SelectCity, SelectCountry } from "./selectCity";
import { SelectCurrency } from "./selectCurrency";
import telegramService from "../services/telegram/telegram.service";
import { selectCurrencyType } from "./selectCurrencyType";
export class ExchangeCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle(): void {
    this.bot.action("exchange", async (ctx) => {
      ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      ctx.session.exchangeState = {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      ctx.session.exchangeProp = {};
      await selectCurrencyType(ctx, "give");
    });
    this.bot.command("exchange", async (ctx) => {
      ctx.session.exchangeState = {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      ctx.session.exchangeProp = {};
      await selectCurrencyType(ctx, "give");
    });
    this.bot.action(/exchangeGiveType:.+/, async (ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const selectedType = ctx.callbackQuery.data.split(":")[1];
      if (!ctx.session.exchangeProp.giveType)
        ctx.session.exchangeProp = {
          ...ctx.session.exchangeProp,
          giveType: {
            value: selectedType,
            label: "",
          },
        };
      else
        ctx.session.exchangeProp = {
          ...ctx.session.exchangeProp,
          getType: {
            value: selectedType,
            label: "",
          },
        };
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      await SelectCurrency(ctx, selectedType === "crypto" ? "crypto" : "fiat");
    });
    this.bot.action(/selectCity:.+/, async (ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const selectedCity = ctx.callbackQuery.data.split(":")[1];
      ctx.session.exchangeProp = {
        ...ctx.session.exchangeProp,
        city: selectedCity,
      };
      ctx.scene.enter("exchange");
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
    });
    this.bot.action(/selectCountry:.+/, async (ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const selectedCountry = ctx.callbackQuery.data.split(":")[1];
      ctx.session.exchangeState.country = selectedCountry;
      SelectCity(ctx);
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
    });
    this.bot.action("nextCountry", async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      if (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        ctx.session.exchangeState.countryIndex <
        Object.keys(ctx.session.exchangeState.cities).length - 1
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        ctx.session.exchangeState.countryIndex =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          ctx.session.exchangeState.countryIndex + 1;
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        ctx.session.exchangeState.countryIndex = 0;
      }
      await SelectCity(ctx);
    });
    this.bot.action("prevCountry", async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      if (ctx.session.exchangeState.countryIndex > 0) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        ctx.session.exchangeState.countryIndex =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          ctx.session.exchangeState.countryIndex - 1;
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        ctx.session.exchangeState.countryIndex =
          Object.keys(ctx.session.exchangeState.cities).length - 1;
      }
      await SelectCity(ctx);
    });
    this.bot.action(/getCyrrencyType:.+/, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const selectedType = ctx.callbackQuery.data.split(":")[1];
      await SelectCurrency(ctx, selectedType);
    });
    this.bot.action(/selectCurrency:.+/, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const selectedCurrency = ctx.callbackQuery.data.split(":")[1];
      const foundCurrency = ctx.session.exchangeState.currencyList.find(
        (currency) => currency.value === selectedCurrency
      );
      if (ctx.session.exchangeProp.giveCurrency == null) {
        ctx.session.exchangeProp.giveCurrency = foundCurrency;
        await selectCurrencyType(ctx, "get");
        return;
      } else {
        ctx.session.exchangeProp.getCurrency = foundCurrency;
        if (
          ctx.session.exchangeProp.giveType?.value === "cash" ||
          ctx.session.exchangeProp.getType?.value == "cash"
        ) {
          await SelectCountry(ctx);
          return;
        }
      }
      ctx.scene.enter("exchange");
    });
    this.bot.action(/selectBank:.+/, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const selectedBank = ctx.callbackQuery.data.split(":")[1];
      ctx.session.exchangeProp.bank = selectedBank;
      ctx.scene.enter("card");
    });
    this.bot.action(/selectChain:.+/, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const selectedChain = ctx.callbackQuery.data.split(":")[1];
      ctx.session.exchangeProp.chain = selectedChain;
      ctx.scene.enter("card");
    });
    this.bot.action("sendMessage", async (ctx) => {
      const lang = ctx.session.language;
      ctx.session.exchangeProp.name = ctx.callbackQuery.from.first_name;

      ctx.session.exchangeProp.telegram = ctx.callbackQuery.from.username;
      ctx.session.exchangeProp.from = "bot";
      ctx.session.exchangeProp.phone = "none";
      const res = await telegramService.sendData(ctx.session.exchangeProp);
      if (res) {
        ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
        ctx.reply(
          `${phrases[lang].successfullySent}`,
          Markup.inlineKeyboard([
            Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu"),
          ])
        );
      }
    });
  }
}
