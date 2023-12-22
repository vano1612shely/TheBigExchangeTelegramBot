import { ICurrency } from "../currency/currency-service.interface";

export interface ITelegramSendMessageRequest {
  requestId: string;
  clientId: string;
  type: string;
  transactionType?: string;
  transactionFrom?: string;
  transactionTo?: string;
  city?: string;
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
  status?: string;
}
