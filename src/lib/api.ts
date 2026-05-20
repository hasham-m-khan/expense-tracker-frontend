import { hc } from "hono/client";
import type { ApiRoutes } from "@server/app";

const client = hc<ApiRoutes>("/");
export type ApiClient = typeof client;

export const api = client.api;
