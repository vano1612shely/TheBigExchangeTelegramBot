import { Markup, Scenes } from "telegraf";
import { IBotContext } from "../context/context.interface";
import infoService from "../services/info/info.service";

export const statusScene = new Scenes.BaseScene<IBotContext>("status");

statusScene.enter(async (ctx) => {
  ctx.reply("Введіть requestId: ");
});

statusScene.on("text", async (ctx) => {
  if (ctx.scene.state.requestId) {
    return;
  }
  const requestId = ctx.message.text;
  ctx.scene.state.requestId = requestId;
  const checkRequest = await infoService.getRequest(requestId);
  if (!checkRequest) {
    ctx.reply("Не знайдено заявку з таким id, спробуйте ще раз");
    return;
  }
  ctx.reply(
    "Виберіть статус заявки",
    Markup.inlineKeyboard([
      [Markup.button.callback("В обробці", "status:in_process")],
      [Markup.button.callback("Завершена", "status:completed")],
      [Markup.button.callback("Відмінена", "status:canceled")],
    ]),
  );
});

statusScene.action(/status:.+/, async (ctx) => {
  console.log(ctx.scene.state.requestId);
  const status = ctx.callbackQuery.data.split(":")[1];
  await infoService.setRequestStatus(ctx.scene.state.requestId, status);
  ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
  ctx.reply("Статус заявки успішно змінено");
  ctx.scene.leave();
});
