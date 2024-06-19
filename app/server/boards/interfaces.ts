import type { Document } from 'mongoose';
import type mongoose from 'mongoose';

export interface IBoard extends Document {
  name: string;
  description?: string;
  posts?: mongoose.Types.ObjectId[];
  creator: mongoose.Types.ObjectId;
}
