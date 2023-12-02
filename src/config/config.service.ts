import { DotenvParseOutput, config } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;
  constructor() {
    const { error, parsed } = config();
    if (error) {
      throw new Error("Error with .env");
    }
    if (!parsed) {
      throw new Error("Error with .env");
    }
    this.config = parsed;
  }
  get(key: string): string {
    const res = this.config[key];
    if (!res) {
      throw new Error("key not found");
    }
    return res;
  }
}
