import type { IUser } from 'app/server/users/interfaces';
import type { Model } from 'mongoose';
import mongoose, { model } from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a user name'],
    maxlength: [60, 'User name cannot be more than 60 characters'],
    unique: [true, 'Same name exists'],
  },
  userName: {
    type: String,
  },
});

export default (mongoose.models.User || model<IUser>('User', UserSchema)) as Model<IUser>;
