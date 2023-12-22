import api from "../api/http";
import { ITelegramSendMessageRequest } from "./telegram-service.interface";
class TelegramService {
  async sendData(data: ITelegramSendMessageRequest): Promise<boolean | null> {
    const res = await api.post("/sendMessage", data);
    if (res.data) {
      return res.data;
    } else return false;
  }
}

export default new TelegramService();
