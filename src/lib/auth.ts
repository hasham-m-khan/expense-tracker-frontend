import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";

export const userQueryOptions = queryOptions({
  queryKey: ["user"],
  queryFn: async () => {
    const res = await api.v1.auth.me.$get();
    if (!res.ok) return null;
    return (await res.json()).data;
  },
  staleTime: Infinity,
});
