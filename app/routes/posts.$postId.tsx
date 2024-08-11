import { ClientLoaderFunctionArgs, Link, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/node';
import invariant from "tiny-invariant";
import type { Post } from '~/type';

export const loader = async ({ params }: LoaderFunctionArgs): Promise<Post> => {
  invariant(params.postId, 'postId is required');
  return { id: params.postId, title: `Post ${params.postId} from server loader` };
}

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs): Promise<Post> => {
  invariant(params.postId, 'postId is required');
  return { id: params.postId, title: `Post ${params.postId} from client loader` };
}

export default function Post() {
  const post = useLoaderData<typeof loader>();

  return (
    <div className="p-24">
      <div className="text-2xl mb-4">
        <Link to="/">Go to home</Link>
      </div>
      <div>{post.title}</div>
    </div>
  )
}
