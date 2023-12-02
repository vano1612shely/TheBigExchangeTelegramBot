import api from "../api/http";
import { ICity, ICityByCountry } from "./city-service.interface";

class CityService {
  async getList(): Promise<ICityByCountry> {
    const res = await api.get("/city");
    return res.data;
  }
  async getListWithoutFormat(): Promise<ICity[]> {
    const res = await api.get("/city/withoutFormat");
    return res.data;
  }
}

export default new CityService();
