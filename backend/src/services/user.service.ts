import { userRepo } from '../repos/user.repo';

export const userService = {
  listUsers: async () => {
    return userRepo.list();
  },
};
