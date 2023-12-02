import api from "../api/http";
import { ICurrency } from "./currency-service.interface";

class CurrencyService {
  async getAll(): Promise<ICurrency[]> {
    const res = await api.get("/currency");
    return res.data;
  }
  async getCrypto(): Promise<ICurrency[]> {
    const res = await api.get("/currency/crypto");
    return res.data;
  }
  async getFiat(): Promise<ICurrency[]> {
    const res = await api.get("/currency/fiat");
    return res.data;
  }
}

export default new CurrencyService();
