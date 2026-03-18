import { Router } from 'express';
import { recordVisitor, getVisitors, getVisitorCount, getTodayVisits } from '../controllers/visitor';

const router = Router();

router.post('/', recordVisitor);
router.get('/', getVisitors);
router.get('/count', getVisitorCount);
router.get('/today', getTodayVisits);

export default router;