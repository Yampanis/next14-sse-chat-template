import dbConnect from 'app/server/db-connect';
import type { IUser } from 'app/server/users/interfaces';
import type mongoose from 'mongoose';

import User from './model';

export const createUser = async ({ name }: IUser) => {
  await dbConnect();
  const data = await User.create({ name, userName: name.toLowerCase() });

  return data;
};

export const getUser = async (id: mongoose.Types.ObjectId) => {
  await dbConnect();
  return User.findById(id);
};

export const getUsers = async () => {
  await dbConnect();
  const data = await User.find({});

  return data;
};

export const findUserByName = async (name: string) => {
  await dbConnect();
  const data = await User.findOne({ username: name.toLowerCase() });

  return data;
};

export const deleteUser = async (id: string) => {
  await dbConnect();
  await User.findByIdAndDelete(id);
};

export const findUserDetailById = async (id: string) => {
  await dbConnect();
  const data = await User.findOne({ _id: id });

  return data;
};
