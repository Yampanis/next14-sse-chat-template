import type { Document } from 'mongoose';
import type mongoose from 'mongoose';

import type { IUser } from '../users/interfaces';

export interface IPost extends Document {
  content: string;
  poster: mongoose.Types.ObjectId;
  board: mongoose.Types.ObjectId;
  createdAt: number;
  updatedAt: number;
}

export interface IPostStoreData extends Document {
  content: string;
  board: mongoose.Types.ObjectId;
  createdAt: number;
  updatedAt: number;
  poster: IUser;
  action?: string;
}
