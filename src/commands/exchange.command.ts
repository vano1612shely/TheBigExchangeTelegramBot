import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { phrases } from "../vocabulary";
import cityService from "../services/city/city.service";
import { SelectCity } from "./selectCity";
export class ExchangeCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle(): void {
    this.bot.action("exchange", async (ctx) => {
      ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      const lang = ctx.session.language;
      ctx.reply(
        `${phrases[lang].selectTypeExchange}: `,
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
      const selectedType = ctx.callbackQuery.data.split(":")[1];
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
        await SelectCity(ctx);
      }
    });
    this.bot.action(/selectCity:.+/, async (ctx) => {
      const selectedCity = ctx.callbackQuery.data.split(":")[1];
      ctx.session.exchangeProp = {
        ...ctx.session.exchangeProp,
        city: selectedCity,
      };
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
    });
    this.bot.action("nextCountry", async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      console.log(ctx.session.exchangeState);
      if (
        ctx.session.exchangeState.countryIndex <
        Object.keys(ctx.session.exchangeState.cities).length - 1
      ) {
        ctx.session.exchangeState.countryIndex =
          ctx.session.exchangeState.countryIndex + 1;
      } else {
        ctx.session.exchangeState.countryIndex = 0;
      }
      await SelectCity(ctx);
    });
    this.bot.action("prevCountry", async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
      console.log(ctx.session.exchangeState);
      if (ctx.session.exchangeState.countryIndex > 0) {
        ctx.session.exchangeState.countryIndex =
          ctx.session.exchangeState.countryIndex - 1;
      } else {
        ctx.session.exchangeState.countryIndex =
          Object.keys(ctx.session.exchangeState.cities).length - 1;
      }
      await SelectCity(ctx);
    });
  }
}
