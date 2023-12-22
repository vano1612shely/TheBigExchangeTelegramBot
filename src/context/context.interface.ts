import { Context, Scenes } from "telegraf";
import { ICityByCountry } from "../services/city/city-service.interface";
import { ICurrency } from "../services/currency/currency-service.interface";
import { ITelegramSendMessageRequest } from "../services/telegram/telegram-service.interface";
export type AllowedLanguage = "ua" | "en" | "ru";
export interface SessionData extends Scenes.SceneSession {
  language: AllowedLanguage;
  exchangeProp: ITelegramSendMessageRequest;
  exchangeState: {
    cities?: ICityByCountry;
    country?: string;
    type?: string;
    currencyList?: ICurrency[];
  };
}

export interface IBotContext extends Context {
  session: SessionData;
  scene: Scenes.SceneContextScene<IBotContext>;
}
