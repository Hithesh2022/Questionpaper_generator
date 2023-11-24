import Router from 'express';
import { getQuestion } from '../controlller/getQuestion.js';    
import { addQuestion } from '../controlller/regquestion.js';
import { get } from 'mongoose';

const router = Router();

router.post ('/question', addQuestion);
router.post('/question/filter', getQuestion)

export default router;
