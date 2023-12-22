import { Scenes, SessionStore, Telegraf, session } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext, SessionData } from "./context/context.interface";
import { store } from "./store/store";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import { BackToMenuCommand } from "./commands/backToMenu.command";
import { LanguageCommand } from "./commands/language.command";
import { ContactsCommand } from "./commands/contacts.command";
import { ExchangeCommand } from "./commands/exchange.command";
import { exchangeScene } from "./scenes/exchange.scene";
import { cardScene } from "./scenes/card.scene";
import { statusScene } from "./scenes/status.scene";
import { StatusCommand } from "./commands/status.command";
import { HistoryCommand } from "./commands/exchangeHistory.command";
class Bot {
  bot: Telegraf<IBotContext>;
  constructor(
    private readonly configService: IConfigService,
    private readonly store: SessionStore<SessionData>,
    private readonly commands: Array<
      new (bot: Telegraf<IBotContext>) => Command
    >,
    private readonly stage: Scenes.Stage<IBotContext>,
  ) {
    this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"));
    this.bot.use(session({ store: this.store }));
    this.bot.use(stage.middleware());
  }

  init() {
    for (const command of this.commands) {
      const tmp = new command(this.bot);
      tmp.handle();
    }
    this.bot.launch();
  }
}

const commands: Array<new (bot: Telegraf<IBotContext>) => Command> = [
  StartCommand,
  BackToMenuCommand,
  LanguageCommand,
  ContactsCommand,
  ExchangeCommand,
  StatusCommand,
  HistoryCommand,
];
const stage = new Scenes.Stage<IBotContext>([
  exchangeScene,
  cardScene,
  statusScene,
]);

const bot = new Bot(new ConfigService(), store, commands, stage);
bot.init();
