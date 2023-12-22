import { Markup } from "telegraf";

import { IBotContext } from "../context/context.interface";
import { phrases } from "../vocabulary";
import { ICity } from "../services/city/city-service.interface";

export async function SelectCountry(ctx: IBotContext) {
  const country = ctx.session.exchangeState.cities;
  const lang = ctx.session.language;
  const chunks = []; // Split cities into chunks for display
  const chunkSize = 2; // Number of cities per row
  for (let i = 0; i < Object.keys(country).length; i += chunkSize) {
    chunks.push(Object.keys(country).slice(i, i + chunkSize));
  }

  const buttons = chunks.map((chunk) =>
    chunk.map((country: string) =>
      Markup.button.callback(country, `selectCountry:${country}`),
    ),
  );
  ctx.reply(
    `${phrases[lang].selectCountry}`,
    Markup.inlineKeyboard([
      ...buttons,
      [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
    ]),
  );
}

export async function SelectCity(ctx: IBotContext) {
  const country = ctx.session.exchangeState.country; // Default to the first country
  const cities = ctx.session.exchangeState.cities[country];
  const lang = ctx.session.language;
  const chunks = []; // Split cities into chunks for display
  const chunkSize = 2; // Number of cities per row
  for (let i = 0; i < cities.length; i += chunkSize) {
    chunks.push(cities.slice(i, i + chunkSize));
  }

  const buttons = chunks.map((chunk) =>
    chunk.map((city: ICity) =>
      Markup.button.callback(city.city_name, `selectCity:${city.city_name}`),
    ),
  );
  ctx.reply(
    `${phrases[lang].selectCity}\n${phrases[lang].country} ${country}`,
    Markup.inlineKeyboard([
      ...buttons,
      [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
    ]),
  );
}
