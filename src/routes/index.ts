import express from 'express';
import { userRouter } from './userRouter';
import { textRouter } from './textRouter';
import { commentRouter } from './commentRouter';

export const router = express.Router();

router.use('/users', userRouter);

router.use('/texts', textRouter);

router.use('/comments', commentRouter);