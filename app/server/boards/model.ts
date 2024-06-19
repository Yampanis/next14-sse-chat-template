import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

import type { IBoard } from './interfaces';

const BoardSchema: Schema<IBoard> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default (mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema)) as Model<IBoard>;
