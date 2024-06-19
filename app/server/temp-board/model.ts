import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

import type { ITempBoard } from './interfaces';

const TempBoardSchema: Schema<ITempBoard> = new Schema({
  expiredTime: { type: Number, required: true },
  board: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
});

export default (mongoose.models.TempBoard ||
  mongoose.model<ITempBoard>('TempBoard', TempBoardSchema)) as Model<ITempBoard>;
