import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { phrases } from "../vocabulary";
import { v4 } from "uuid";
import cityService from "../services/city/city.service";
import { SelectCity, SelectCountry } from "./selectCity";
import { SelectCurrency, SelectTypeCurrency } from "./selectCurrency";
import telegramService from "../services/telegram/telegram.service";
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
      const lang = ctx.session.language;
      ctx.reply(
        `${phrases[lang].selectTypeExchange} `,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              `${phrases[lang].exchengeType1}`,
              "exchangeType:online",
            ),
          ],
          [
            Markup.button.callback(
              `${phrases[lang].exchengeType2}`,
              "exchangeType:offline",
            ),
          ],
          [
            Markup.button.callback(
              `${phrases[lang].exchengeType3}`,
              "exchangeType:transaction",
            ),
          ],
          [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
        ]),
      );
    });
    this.bot.command("exchange", async (ctx) => {
      ctx.session.exchangeState = {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      ctx.session.exchangeProp = {};
      const lang = ctx.session.language;
      ctx.reply(
        `${phrases[lang].selectTypeExchange} `,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              `${phrases[lang].exchengeType1}`,
              "exchangeType:online",
            ),
          ],
          [
            Markup.button.callback(
              `${phrases[lang].exchengeType2}`,
              "exchangeType:offline",
            ),
          ],
          [
            Markup.button.callback(
              `${phrases[lang].exchengeType3}`,
              "exchangeType:transaction",
            ),
          ],
          [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
        ]),
      );
    });
    this.bot.action(/exchangeType:.+/, async (ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const selectedType = ctx.callbackQuery.data.split(":")[1];
      const lang = ctx.session.language;
      ctx.session.exchangeProp = {
        ...ctx.session.exchangeProp,
        type: selectedType,
      };
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      if (selectedType == "offline") {
        const cities = await cityService.getList();
        ctx.session.exchangeState = {
          ...ctx.session.exchangeState,
          cities: cities,
        };
        await SelectCountry(ctx);
      } else if (selectedType == "online") {
        await SelectTypeCurrency(ctx);
      } else if (selectedType == "transaction") {
        ctx.reply(
          `${phrases[lang].selectTypeTransfer}`,
          Markup.inlineKeyboard([
            [
              Markup.button.callback(
                `${phrases[lang].exchengeType1}`,
                "transaction:online",
              ),
              Markup.button.callback(
                `${phrases[lang].exchengeType2}`,
                "transaction:offline",
              ),
            ],
            [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
          ]),
        );
      }
    });
    this.bot.action(/selectCity:.+/, async (ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const selectedCity = ctx.callbackQuery.data.split(":")[1];
      if (ctx.session.exchangeProp.type == "offline") {
        ctx.session.exchangeProp = {
          ...ctx.session.exchangeProp,
          city: selectedCity,
        };
        SelectTypeCurrency(ctx);
      } else if (
        ctx.session.exchangeProp.type == "transaction" &&
        ctx.session.exchangeProp.transactionType == "offline"
      ) {
        if (!ctx.session.exchangeProp.transactionFrom) {
          ctx.session.exchangeProp = {
            ...ctx.session.exchangeProp,
            transactionFrom: selectedCity,
          };
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          ctx.session.exchangeState.countryIndex = 0;
          SelectCountry(ctx);
        } else {
          ctx.session.exchangeProp = {
            ...ctx.session.exchangeProp,
            transactionTo: selectedCity,
          };
          await SelectCurrency(ctx, "fiat");
        }
      }
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
        (currency) => currency.value === selectedCurrency,
      );
      if (ctx.session.exchangeProp.giveCurrency == null) {
        ctx.session.exchangeProp.giveCurrency = foundCurrency;
        if (ctx.session.exchangeProp.type == "transaction") {
          await SelectCurrency(ctx, "fiat");
          return;
        }
        if (foundCurrency?.type == "crypto") {
          await SelectCurrency(ctx, "fiat");
          return;
        } else {
          await SelectCurrency(ctx, "crypto");
          return;
        }
      } else {
        ctx.session.exchangeProp.getCurrency = foundCurrency;
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
    this.bot.action(/transaction:.+/, async (ctx) => {
      ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      const cities = await cityService.getList();
      ctx.session.exchangeState = {
        ...ctx.session.exchangeState,
        cities: cities,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const selectedType = ctx.callbackQuery.data.split(":")[1];
      ctx.session.exchangeProp.transactionType = selectedType;
      if (selectedType == "online") {
        await SelectCurrency(ctx, "fiat");
      } else {
        SelectCountry(ctx);
      }
    });
    this.bot.action("sendMessage", async (ctx) => {
      const lang = ctx.session.language;
      ctx.session.exchangeProp.name = ctx.callbackQuery.from.first_name;

      ctx.session.exchangeProp.telegram = ctx.callbackQuery.from.username;
      ctx.session.exchangeProp.from = "bot";
      ctx.session.exchangeProp.phone = "none";
      ctx.session.exchangeProp.requestId = v4();
      ctx.session.exchangeProp.clientId = ctx.callbackQuery.from.id.toString();
      const res = await telegramService.sendData(ctx.session.exchangeProp);
      if (res) {
        ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
        ctx.reply(
          `${phrases[lang].successfullySent}`,
          Markup.inlineKeyboard([
            Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu"),
          ]),
        );
      }
    });
  }
}
