import dbConnect from 'app/server/db-connect';
import mongoose from 'mongoose';

import type { IPost, IPostStoreData } from './interfaces';
import Post from './model';

export const createPost = async (post: IPost) => {
  await dbConnect();
  const document = new Post(post);
  const saved = await document.save();
  return (await Post.findById(saved._id).populate('poster').exec()) as IPostStoreData;
};

export const updatePost = async (post: IPost) => {
  await dbConnect();
  await Post.findByIdAndUpdate(post._id, post);
  return Post.findById(post._id).populate('poster').exec();
};

export const getPostsByBoard = async (boardId: string) => {
  await dbConnect();
  return Post.find({ board: new mongoose.Types.ObjectId(boardId) });
};

export const getPostsByBoardWithUser = async (boardId: string) => {
  await dbConnect();
  return (await Post.find({ board: new mongoose.Types.ObjectId(boardId) })
    .sort({ createdAt: 1 })
    .populate('poster')
    .exec()) as IPostStoreData[];
};

export const deletePost = async (id: mongoose.Types.ObjectId) => {
  await dbConnect();
  const deletedData = await Post.findById(id).populate('poster').exec();
  await Post.findByIdAndDelete(id);
  return deletedData;
};
