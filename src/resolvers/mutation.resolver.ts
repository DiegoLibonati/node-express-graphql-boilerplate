import axios, { type AxiosResponse } from "axios";

import type { CreateUserArgs } from "@/types/args";
import type { User } from "@/types/app";

import { envs } from "@/configs/env.config";

const API_URL = envs.API_URL;

export const MutationResolver = {
  createUser: async (_parent: unknown, args: CreateUserArgs): Promise<User> => {
    const res: AxiosResponse<User> = await axios.post(`${API_URL}/users`, args.input);
    return res.data;
  },
};
