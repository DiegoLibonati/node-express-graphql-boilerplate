import type { User } from "@/types/app";
import type { UserArgs } from "@/types/args";
import type { ResponseDirect } from "@/types/responses";

import { httpClient } from "@/configs/http_client.config";

export const QueryResolver = {
  users: async (): Promise<User[]> => {
    const res = await httpClient.get<ResponseDirect<User[]>>(`/users`);
    return res.data;
  },

  user: async (_parent: unknown, args: UserArgs): Promise<User> => {
    const res = await httpClient.get<ResponseDirect<User>>(`/users/${args.id}`);
    return res.data;
  },
};
