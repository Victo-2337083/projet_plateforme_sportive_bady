import { Router } from 'express';
import { userService } from '../services/user.service';

const userRouter = Router();

userRouter.get('/', async (_req, res, next) => {
  try {
    const users = await userService.listUsers();
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
});

export default userRouter;
