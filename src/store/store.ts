import { SQLite } from "@telegraf/session/sqlite";
import { AsyncSessionStore } from "telegraf/typings/session";
import { SessionData } from "../context/context.interface";

export const store: AsyncSessionStore<SessionData> = {
  async get(key: string): Promise<SessionData | undefined> {
    return await SQLiteStore.get(key);
  },
  async set(key: string, value: SessionData): Promise<void> {
    await SQLiteStore.set(key, value);
  },
  async delete(key: string): Promise<void> {
    await SQLiteStore.delete(key);
  },
};
const SQLiteStore = SQLite<SessionData>({
  filename: "./telegraf-sessions.sqlite",
});
