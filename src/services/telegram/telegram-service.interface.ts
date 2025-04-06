import { ICurrency } from "../currency/currency-service.interface";

export interface ITelegramSendMessageRequest {
  city?: string;
  getType?: {
    value: string;
    label: string;
  };
  giveType?: {
    value: string;
    label: string;
  };
  getCurrency: ICurrency | null;
  giveCurrency: ICurrency | null;
  getSum: number;
  giveSum: number;
  name: string;
  phone?: string;
  telegram: string;
  email?: string;
  exchange: number;
  bank?: string;
  chain?: string;
  wallet?: string;
  from?: string;
}
