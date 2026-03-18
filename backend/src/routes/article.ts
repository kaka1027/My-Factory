import express from 'express';
import { getArticleCount, getRecentArticles, getArticles, getCategories } from '../controllers/article';

const router = express.Router();

router.get('/count', getArticleCount);
router.get('/recent', getRecentArticles);
router.get('/categories', getCategories);
router.get('/', getArticles);

export default router;
