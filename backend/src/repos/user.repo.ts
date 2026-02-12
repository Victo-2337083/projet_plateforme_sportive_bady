import { User } from '../models/User';

const seedUsers: User[] = [
  {
    id: 1,
    fullName: 'Admin Plateforme',
    email: 'admin@plateforme.local',
    createdAt: new Date(),
  },
];

export const userRepo = {
  list: async () => {
    return seedUsers;
  },
};
