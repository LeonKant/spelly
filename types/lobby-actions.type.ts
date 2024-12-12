import { SupabaseClient, User } from "@supabase/supabase-js";
import { SpellyLobbyT } from "./db.type";

export type WithoutErrorParamsT =
  | Omit<{ [key: string]: any }, "message" | "error">
  | {};

type ActionResponseSuccessT<T extends WithoutErrorParamsT> = {
  error: false;
  message?: string;
} & T;
type ActionResponseError<T extends WithoutErrorParamsT> = {
  error: true;
  message: string;
} & Partial<T>;

export type ActionResponse<T extends WithoutErrorParamsT = {}> =
  | ActionResponseSuccessT<T>
  | ActionResponseError<T>;

export type ClientInfoT = {
  user: User;
  supabase: SupabaseClient<any, "public", any>;
};
export type ClientAndLobbyInfoT = {
  lobbyInfo: SpellyLobbyT;
} & ClientInfoT;
