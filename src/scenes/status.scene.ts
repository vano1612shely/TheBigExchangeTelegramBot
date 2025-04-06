import { Markup, Scenes } from "telegraf";
import { IBotContext } from "../context/context.interface";
import infoService from "../services/info/info.service";

export const statusScene = new Scenes.BaseScene<IBotContext>("status");
const status = {
  IN_PROGRESS: "В обробці",
  PAYOUT_PROCESS: "Процес виплати",
  COMPLETED: "Завершена",
  CANCELED: "Відмінена",
};
statusScene.enter(async (ctx) => {
  ctx.reply(
    "Введіть requestId: ",
    Markup.inlineKeyboard([[Markup.button.callback("Назад", "status:leave")]])
  );
});

statusScene.on("text", async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  if (ctx.scene.state.requestId) {
    return;
  }
  const requestId = ctx.message.text;

  if (!Number(requestId)) {
    ctx.reply(
      "Введіть валідний id",
      Markup.inlineKeyboard([[Markup.button.callback("Назад", "status:leave")]])
    );
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  ctx.scene.state.requestId = requestId;
  const checkRequest = await infoService.getRequest(requestId);
  if (!checkRequest) {
    ctx.reply(
      "Не знайдено заявку з таким id, спробуйте ще раз",
      Markup.inlineKeyboard([[Markup.button.callback("Назад", "status:leave")]])
    );
    return;
  }
  ctx.reply(
    `Поточний статус: ${status[checkRequest.status]}\nВиберіть статус заявки`,
    Markup.inlineKeyboard([
      [Markup.button.callback("В обробці", "status:0")],
      [Markup.button.callback("Процес виплати", "status:1")],
      [Markup.button.callback("Завершена", "status:2")],
      [Markup.button.callback("Відмінена", "status:3")],
      [Markup.button.callback("Назад", "status:leave")],
    ])
  );
});

statusScene.action(/status:.+/, async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  const status = ctx.callbackQuery.data.split(":")[1];
  ctx.deleteMessage(ctx.callbackQuery.message.message_id);
  if (status === "leave") {
    ctx.reply("Дія відмінена");
    ctx.scene.leave();
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  await infoService.setRequestStatus(ctx.scene.state.requestId, Number(status));

  ctx.reply("Статус заявки успішно змінено");
  ctx.scene.leave();
});
