import { Router } from 'express';
import { recordVisitor, getVisitors } from '../controllers/visitor';

const router = Router();

router.post('/', recordVisitor);
router.get('/', getVisitors);

export default router;