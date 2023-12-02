export interface ICurrency {
  id?: number;
  title: string;
  value: string;
  type: "fiat" | "crypto";
  icon_link?: string;
  percent?: number;
}
