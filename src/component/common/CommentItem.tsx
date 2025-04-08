'use client';
import { findUserByUserId } from '@/lib/mongo/actions/UserActions';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { TZodCommentSchema } from '@/lib/mongo/schema/CommentSchema';
import { useEffect, useState } from 'react';
import { TZodUserSchema } from '@/lib/mongo/schema/UserSchema';
export interface ICommentItemProps {
  comment: TZodCommentSchema & { _id: string };
  edit?: boolean;
  deleteFnc?: (id: string) => Promise<void> | void;
}
export default function CommentItem({ comment, edit, deleteFnc }: ICommentItemProps) {
  const [user, setUser] = useState<TZodUserSchema | undefined>(undefined);
  useEffect(() => {
    reload();
  }, []);
  const reload = async () => {
    const userRaw = await findUserByUserId(comment.userId);
    setUser(userRaw ?? undefined);
  };
  return (
    <div className="rounded text-themeDark bg-white shadow flex flex-col p-4 gap-2 w-full">
      <h1 className="flex justify-between font-bold">
        {user?.preferredName}
        {edit && deleteFnc ? (
          <div className="flex flex-end">
            <IconButton onClick={() => deleteFnc(comment._id)}>
              <CloseIcon></CloseIcon>
            </IconButton>
          </div>
        ) : (
          <></>
        )}
      </h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: comment.comment ?? '' }}
      />
      <div className="flex w-full justify-end">
        {dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}
      </div>
    </div>
  );
}
