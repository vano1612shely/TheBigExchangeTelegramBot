import { Markup } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { IBank } from "../services/banks/banks-service.interface";
import banksService from "../services/banks/banks.service";
import { phrases } from "../vocabulary";

export async function bank(ctx: IBotContext) {
  const lang = ctx.session.language;
  const banks = await banksService.getAll();
  if (banks.length == 0) {
    ctx.scene.enter("card");
    return;
  }
  const chunks = []; // Split cities into chunks for display
  const chunkSize = 2; // Number of cities per row
  for (let i = 0; i < banks.length; i += chunkSize) {
    chunks.push(banks.slice(i, i + chunkSize));
  }

  const buttons = chunks.map((chunk) =>
    chunk.map((bank: IBank) =>
      Markup.button.callback(bank.name, `selectBank:${bank.name}`),
    ),
  );
  ctx.reply(
    "Choose a bank:",
    Markup.inlineKeyboard([
      ...buttons,
      [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
    ]),
  );
}
