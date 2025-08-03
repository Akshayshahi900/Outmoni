import { Router } from 'express';
import { authenticateUser } from '../middlewares/error.middleware';
import { createUserIfNotExists } from '../controllers/auth.controller';


const router = Router();


router.get('/me', authenticateUser, createUserIfNotExists);


export default router;
