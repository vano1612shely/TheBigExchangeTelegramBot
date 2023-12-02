import { Context, Scenes } from "telegraf";
import { ICityByCountry } from "../services/city/city-service.interface";
import { ICurrency } from "../services/currency/currency-service.interface";
export type AllowedLanguage = "ua" | "en" | "ru";
export type ExchangePropType = {
  type: string;
  transactionType?: string;
  transactionFrom?: string;
  transactionTo?: string;
  city?: string;
  getCurrency: ICurrency | null;
  giveCurrency: ICurrency | null;
  getSum: number;
  giveSum: number;
  exchange: number;
  walletType?: string;
  wallet?: string;
};
export interface SessionData extends Scenes.SceneSession {
  language: AllowedLanguage;
  exchangeProp: ExchangePropType;
  exchangeState: {
    cities: ICityByCountry;
    countryIndex: number;
  };
}

export interface IBotContext extends Context {
  session: SessionData;
  scene: Scenes.SceneContextScene<IBotContext>;
}
