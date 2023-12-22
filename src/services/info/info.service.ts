import api from "../api/http";
import { IDataResponse } from "./info-service.interface";
class InfoService {
  async getAllData(): Promise<IDataResponse | null> {
    const res = await api.get("/info/getAll");
    if (res.data) {
      return res.data;
    } else return null;
  }
  async getRequest(requestId: string) {
    const res = await api.get("/client/request", { data: { id: requestId } });
    console.log(res.data);
    return res.data;
  }
  async setRequestStatus(requestId: string, status: string) {
    const res = await api.post("/client/setStatus", {
      requestId,
      status,
    });
    return res;
  }

  async getRequestsByClientId(clientId: string) {
    const res = await api.get("/client/getRequestsByClientId", {
      data: { clientId },
    });
    return res.data;
  }
}

export default new InfoService();
