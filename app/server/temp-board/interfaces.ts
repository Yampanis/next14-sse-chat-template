import type { Document } from 'mongoose';
import type mongoose from 'mongoose';

export interface ITempBoard extends Document {
  board: mongoose.Types.ObjectId;
  expiredTime: number;
}
