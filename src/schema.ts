import * as zod from 'zod';

export const LoginSchema = zod.object({
  name: zod.string().min(1, { message: 'User name is required' }),
});

export const BoardSchema = zod.object({
  name: zod.string().min(1, { message: 'Board name is required' }),
  description: zod.string().optional(),
  creator: zod.string().optional(),
});

export const BoardUpdateSchema = BoardSchema.extend({
  _id: zod.string().min(1, { message: 'Board id is required' }),
});

export const PostCreateSchema = zod.object({
  content: zod.string().min(1, { message: 'Content is required' }),
  poster: zod.string().min(1, { message: 'Author is required' }),
  board: zod.string().min(1, { message: 'Board is required' }),
});

export const PostUpdateSchema = zod.object({
  content: zod.string().min(1, { message: 'Content is required' }),
  poster: zod.string().min(1, { message: 'Author is required' }),
  board: zod.string().min(1, { message: 'Board is required' }),
  createdAt: zod.number(),
  updatedAt: zod.number(),
  _id: zod.string(),
});

export const PostDeleteSchema = zod.object({
  _id: zod.string(),
});

export const createTempBoardSchema = zod.object({
  board: zod.string(),
});
