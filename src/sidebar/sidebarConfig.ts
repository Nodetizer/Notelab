import { Incoming, Today } from "../assets/icons";

export const SIDEBAR_ITEMS = [
  {
    to: "/incoming",
    icon: Incoming,
    text: "Входящие",
  },
  {
    to: "/today",
    icon: Today,
    text: "Сегодня",
  },
] as const;
