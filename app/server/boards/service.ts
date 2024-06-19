import type { IBoard } from 'app/server/boards/interfaces';
import dbConnect from 'app/server/db-connect';
import mongoose from 'mongoose';

import Post from '../posts/model';
import Board from './model';

export const createBoardByData = async (board: IBoard) => {
  await dbConnect();
  const document = new Board(board);
  return document.save();
};

export const updateBoardByData = async (board: IBoard) => {
  await dbConnect();
  const document = new Board(board);
  return document.save();
};

export const getBoardById = async (id: string) => {
  await dbConnect();
  return Board.findById(new mongoose.Types.ObjectId(id));
};

export const getBoards = async (userId?: string) => {
  await dbConnect();
  return Board.find(userId ? { creator: new mongoose.Types.ObjectId(userId) } : {});
};

export const deleteBoard = async (boardId: string) => {
  await dbConnect();
  await Board.findByIdAndDelete(new mongoose.Types.ObjectId(boardId));
  await Post.deleteMany({ board: new mongoose.Types.ObjectId(boardId) });
};
