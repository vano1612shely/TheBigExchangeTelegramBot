import { Markup } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { IChain } from "../services/chain/chain-service.interface";
import chainService from "../services/chain/chain.service";
import { phrases } from "../vocabulary";

export async function chain(ctx: IBotContext) {
  const lang = ctx.session.language;
  const chains = await chainService.getChainsForCurrency(
    ctx.session.exchangeProp.getCurrency?.id,
  );
  if (chains.length == 0) {
    ctx.scene.enter("card");
    return;
  }
  const chunks = []; // Split cities into chunks for display
  const chunkSize = 2; // Number of cities per row
  for (let i = 0; i < chains.length; i += chunkSize) {
    chunks.push(chains.slice(i, i + chunkSize));
  }

  const buttons = chunks.map((chunk) =>
    chunk.map((chain: IChain) =>
      Markup.button.callback(chain.name, `selectChain:${chain.name}`),
    ),
  );
  ctx.reply(
    "Choose a chain:",
    Markup.inlineKeyboard([
      ...buttons,
      [Markup.button.callback(`${phrases[lang].menu}`, "back_to_menu")],
    ]),
  );
}
