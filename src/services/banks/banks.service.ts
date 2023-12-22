import api from "../api/http";
import { IBank } from "./banks-service.interface";

class CurrencyService {
  async getAll(): Promise<IBank[]> {
    const res = await api.get("/banks");
    return res.data;
  }
}

export default new CurrencyService();
