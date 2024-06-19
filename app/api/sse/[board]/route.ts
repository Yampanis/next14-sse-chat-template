import { EventEmitter } from 'node:events';

import type { IPost } from 'app/server/posts/interfaces';
import { createPost, deletePost, getPostsByBoardWithUser, updatePost } from 'app/server/posts/service';
import mongoose from 'mongoose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PostCreateSchema, PostDeleteSchema, PostUpdateSchema } from 'src/schema';

// export const emitter = new EventEmitter();
let emitterMaps: Map<string, EventEmitter>;

const getEmitterMaps = () => {
  if (emitterMaps) return emitterMaps;
  emitterMaps = new Map()
  return emitterMaps;
}

export async function GET(req: NextRequest, { params }: { params: { board: string } }) {
  if (!getEmitterMaps().has(params.board)) getEmitterMaps().set(params.board, new EventEmitter())
  const emitter = getEmitterMaps().get(params.board) as EventEmitter;
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  emitter.on('newMessage', (message) => {
    writer.write(`data: ${JSON.stringify(message)} \n\n`);
  });

  const posts = await getPostsByBoardWithUser(params.board);

  emitter.emit('newMessage', posts);

  return new NextResponse(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

export async function POST(req: NextRequest, { params }: { params: { board: string } }) {
  if (!getEmitterMaps().has(params.board)) getEmitterMaps().set(params.board, new EventEmitter())
  const emitter = getEmitterMaps().get(params.board) as EventEmitter;
  const body = await req.json();
  const validatedFields = PostCreateSchema.safeParse(body);
  if (!validatedFields.success) {
    return { message: 'Invalid fields!' };
  }

  const post = {
    content: validatedFields.data.content,
    poster: new mongoose.Types.ObjectId(validatedFields.data.poster),
    board: new mongoose.Types.ObjectId(validatedFields.data.board),
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  } as IPost;

  try {
    const document = await createPost(post);
    emitter.emit('newMessage', [document]);
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Database error' };
  }
  return { success: true };
}

export async function PUT(req: NextRequest, { params }: { params: { board: string } }) {
  if (!getEmitterMaps().has(params.board)) getEmitterMaps().set(params.board, new EventEmitter())
  const emitter = getEmitterMaps().get(params.board) as EventEmitter;
  const body = await req.json();
  const validatedFields = PostUpdateSchema.safeParse(body);
  if (!validatedFields.success) {
    return { message: 'Invalid fields!' };
  }

  const post = {
    content: validatedFields.data.content,
    poster: new mongoose.Types.ObjectId(validatedFields.data.poster),
    board: new mongoose.Types.ObjectId(validatedFields.data.board),
    createdAt: validatedFields.data.createdAt,
    updatedAt: new Date().getTime(),
    _id: new mongoose.Types.ObjectId(validatedFields.data._id),
  } as IPost;

  try {
    const document = await updatePost(post);
    // @ts-ignore
    emitter.emit('newMessage', [{ ...document._doc, action: 'update' }]);
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Database error' };
  }
  return { success: true };
}

export async function DELETE(req: NextRequest, { params }: { params: { board: string } }) {
  if (!getEmitterMaps().has(params.board)) getEmitterMaps().set(params.board, new EventEmitter())
  const emitter = getEmitterMaps().get(params.board) as EventEmitter;
  const body = await req.json();
  const validatedFields = PostDeleteSchema.safeParse(body);
  if (!validatedFields.success) {
    return { message: 'Invalid fields!' };
  }

  try {
    const document = await deletePost(new mongoose.Types.ObjectId(validatedFields.data._id));
    // @ts-ignore
    emitter.emit('newMessage', [{ ...document._doc, action: 'delete' }]);
  } catch (e) {
    console.log(e);
    return { success: false, message: 'Database error' };
  }
  return { success: true };
}
