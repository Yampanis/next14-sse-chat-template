import dbConnect from 'app/server/db-connect';
import mongoose from 'mongoose';

import type { ITempBoard } from './interfaces';
import TempBoard from './model';

export const createTempBoard = async (board: ITempBoard) => {
  await dbConnect();
  const document = new TempBoard(board);
  return document.save();
};

export const getTempBoardById = async (id: string) => {
  await dbConnect();
  return TempBoard.findById(new mongoose.Types.ObjectId(id));
};

export const getTempBoardByBoard = async (board: string) => {
  await dbConnect();
  return TempBoard.findOne({ board: new mongoose.Types.ObjectId(board) });
};

export const deleteTempBoard = async (id: mongoose.Types.ObjectId) => {
  await dbConnect();
  await TempBoard.findByIdAndDelete(id);
};
