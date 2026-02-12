import { Router } from 'express';
import statusRoutes from './status.routes';

const router = Router();

router.use('/', statusRoutes);
// Ajoute tes routes ici :
// router.use('/users', userRoutes);

export default router;

