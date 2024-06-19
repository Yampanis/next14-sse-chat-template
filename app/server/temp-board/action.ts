'use server';

import mongoose from 'mongoose';
import { createTempBoardSchema } from 'src/schema';
import type zod from 'zod';

import type { ITempBoard } from './interfaces';
import { createTempBoard as createTempBoardService, deleteTempBoard, getTempBoardByBoard } from './service';

export const createTempBoard = async (values: zod.infer<typeof createTempBoardSchema>) => {
  const validatedFields = createTempBoardSchema.safeParse(values);

  if (!validatedFields.success) {
    return { message: 'Invalid fields!' };
  }

  const { board } = validatedFields.data;

  try {
    return JSON.stringify(
      await createTempBoardService({
        board: new mongoose.Types.ObjectId(board),
        expiredTime: new Date().getTime() + 3600 * 1000,
      } as ITempBoard),
    );
  } catch (error) {
    console.log(error);
    return { message: 'Database error' };
  }
};

export const getExpirationTime = async (board: string) => {
  try {
    const document = await getTempBoardByBoard(board);
    if (!document) {
      return 0;
    }
    const expiredTime = document.get('expiredTime');
    if (expiredTime < new Date().getTime()) {
      await deleteTempBoard(document._id);
    }
    return expiredTime;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
