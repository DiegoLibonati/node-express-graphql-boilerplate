import type { AxiosResponse } from "axios";
import type { CreateUserArgs } from "@/types/args";
import type { User } from "@/types/app";

import { httpClient } from "@/configs/http_client.config";

export const MutationResolver = {
  createUser: async (_parent: unknown, args: CreateUserArgs): Promise<User> => {
    const res: AxiosResponse<User> = await httpClient.post(`/users`, args.input);
    return res.data;
  },
};
