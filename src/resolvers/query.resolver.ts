import axios from "axios";

import type { User } from "@/types/app";
import type { UserArgs } from "@/types/args";
import type { ResponseDirect } from "@/types/responses";

import { envs } from "@/configs/env.config";

const API_URL = envs.API_URL;

export const QueryResolver = {
  users: async (): Promise<User[]> => {
    const res = await axios.get<ResponseDirect<User[]>>(`${API_URL}/users`);
    return res.data;
  },

  user: async (_parent: unknown, args: UserArgs): Promise<User> => {
    const res = await axios.get<ResponseDirect<User>>(`${API_URL}/users/${args.id}`);
    return res.data;
  },
};
