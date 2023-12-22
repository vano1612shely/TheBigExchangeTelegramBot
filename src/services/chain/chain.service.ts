import api from "../api/http";
import { IChain } from "./chain-service.interface";
class ChainService {
  async getChainsForCurrency(currencyId: number): Promise<IChain[]> {
    const res = await api.get(
      `/chain/getChainsByCurrency?currencyId=${currencyId}`,
    );
    return res.data;
  }
}
export default new ChainService();
