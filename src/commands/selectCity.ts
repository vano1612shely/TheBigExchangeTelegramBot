import { Markup } from "telegraf";

import { IBotContext } from "../context/context.interface";
import { phrases } from "../vocabulary";
import { ICity } from "../services/city/city-service.interface";

export async function SelectCity(ctx: IBotContext) {
  if (typeof ctx.session.exchangeState.countryIndex === "undefined") {
    ctx.session.exchangeState.countryIndex = 0;
  }
  const countryIndex = ctx.session.exchangeState.countryIndex;
  const country =
    ctx.state.selectedCountry ||
    Object.keys(ctx.session.exchangeState.cities)[countryIndex]; // Default to the first country
  const cities = ctx.session.exchangeState.cities[country];
  const lang = ctx.session.language;
  const chunks = []; // Split cities into chunks for display
  const chunkSize = 2; // Number of cities per row
  for (let i = 0; i < cities.length; i += chunkSize) {
    chunks.push(cities.slice(i, i + chunkSize));
  }

  const buttons = chunks.map((chunk) =>
    chunk.map((city: ICity) =>
      Markup.button.callback(city.city_name, `selectCity:${city.id}`),
    ),
  );

  const navigationButtons = [
    Markup.button.callback("⬅️ Back", "prevCountry"),
    Markup.button.callback("➡️ Forward", "nextCountry"),
  ];
  ctx.reply(
    `Select city \nCountry: ${country}`,
    Markup.inlineKeyboard([
      ...buttons,
      navigationButtons,
      [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
    ]),
  );
}
