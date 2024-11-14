import express from 'express';
import { userRouter } from './userRouter';
import { textRouter } from './textRouter';

export const router = express.Router();

router.use('/users', userRouter);

router.use('/texts', textRouter);