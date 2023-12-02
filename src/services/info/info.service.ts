import api from "../api/http";
import { IDataResponse } from "./info-service.interface";
class InfoService {
  async getAllData(): Promise<IDataResponse | null> {
    const res = await api.get("/info/getAll");
    if (res.data) {
      return res.data;
    } else return null;
  }
}

export default new InfoService();
