'use server';

import mongoose from 'mongoose';
import { BoardSchema, BoardUpdateSchema } from 'src/schema';
import type zod from 'zod';

import { auth } from '../auth';
import type { IBoard } from './interfaces';
import {
  createBoardByData,
  deleteBoard as deleteBoardById,
  getBoardById,
  getBoards,
  updateBoardByData,
} from './service';

export const createBoard = async (values: zod.infer<typeof BoardSchema>) => {
  const validatedFields = BoardSchema.safeParse(values);

  if (!validatedFields.success) {
    return { message: 'Invalid fields!' };
  }

  const { name, description, creator } = validatedFields.data;

  try {
    return JSON.stringify(
      await createBoardByData({ name, description, creator: new mongoose.Types.ObjectId(creator) } as IBoard),
    );
  } catch (error) {
    console.log(error);
    return { message: 'Database error' };
  }
};

export const updateBoard = async (values: zod.infer<typeof BoardUpdateSchema>) => {
  const validatedFields = BoardUpdateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { message: 'Invalid fields!' };
  }

  const { _id, name, description, creator } = validatedFields.data;

  try {
    return JSON.stringify(
      await updateBoardByData({
        _id: new mongoose.Types.ObjectId(_id),
        name,
        description,
        creator: new mongoose.Types.ObjectId(creator),
      } as IBoard),
    );
  } catch (error) {
    console.log(error);
    return { message: 'Database error' };
  }
};

export const saveBoard = async (name: string, creator: string, _id: string, description: string) => {
  const data = {
    name,
    creator,
    _id,
    description,
  };
  return _id ? updateBoard(data) : createBoard(data);
};

export const getBoard = async (id: string) => {
  try {
    const board = await getBoardById(id);
    return { success: true, data: JSON.stringify(board) };
  } catch (error) {
    return { success: false, message: 'Database error' };
  }
};

export const getBoardsByUserSession = async () => {
  const session = await auth();
  try {
    return await getBoards(session?.user?.id);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllBoards = async () => {
  try {
    return await getBoards();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const deleteBoard = async (board: string) => {
  try {
    await deleteBoardById(board);
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Database error' };
  }
};
