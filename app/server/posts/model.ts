import type { Model } from 'mongoose';
import mongoose, { model, Schema } from 'mongoose';

import type { IPost } from './interfaces';

export const PostSchema: Schema<IPost> = new Schema({
  content: { type: String, required: true },
  poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
});

export default (mongoose.models.Post || model<IPost>('Post', PostSchema)) as Model<IPost>;
