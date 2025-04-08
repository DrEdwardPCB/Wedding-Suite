/* eslint-disable @typescript-eslint/ban-ts-comment */
'use server';

import _ from 'lodash';
import User, { TZodUserSchema } from '../schema/UserSchema';

export const commitAdd = async (user: TZodUserSchema) => {
  console.log('[User] commit add');
  const newUser = new User(user);
  await newUser.save();
};
export const commitDelete = async (id: string) => {
  console.log('[User] commit delete');
  console.log(id);
  await User.findOneAndDelete({ id: id });
};
export const commitUpdate = async (user: TZodUserSchema) => {
  console.log('[User] commit update');
  // console.log(user)
  await User.findOneAndUpdate({ id: user.id }, user).then(user => user.save());
};
export const queryAll = async (): Promise<(TZodUserSchema & { _id: string })[]> => {
  //@ts-ignore
  const parsed = (await User.find({})).map(e => _.omit(e.toJSON(), [, '_id', '__v']));
  return parsed as (TZodUserSchema & { _id: string })[];
};

export const findUserByUserId = async (id: string): Promise<TZodUserSchema | null> => {
  const user = await User.findOne({ id });
  if (!user) {
    return null;
  }
  const parsed = _.omit(user.toJSON(), ['_id', '__v']) as TZodUserSchema;
  return parsed;
};
export const findUserByEmail = async (email: string): Promise<TZodUserSchema | null> => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  console.log(user);
  const parsed = _.omit(user.toJSON(), ['_id', '__v']) as TZodUserSchema;
  console.log(parsed);
  return parsed;
};
export const findUserByMongoId = async (_id: string): Promise<TZodUserSchema | null> => {
  const user = await User.findById(_id);
  if (!user) {
    return null;
  }
  const parsed = _.omit(user.toJSON(), ['_id', '__v']) as TZodUserSchema;
  return parsed;
};
export const findUserByPhysicalPresence = async (
  type: 'Physical' | 'Virtual' | 'All' = 'All',
): Promise<(TZodUserSchema & { _id: string })[]> => {
  if (type === 'All') {
    return await queryAll();
  } else if (type === 'Physical') {
    return (await User.find({ online: false })).map(e =>
      //@ts-ignore
      _.omit(e.toJSON(), [, '_id', '__v']),
    ) as (TZodUserSchema & { _id: string })[];
  } else {
    return (await User.find({ online: true })).map(e =>
      //@ts-ignore
      _.omit(e.toJSON(), [, '_id', '__v']),
    ) as (TZodUserSchema & { _id: string })[];
  }
};
