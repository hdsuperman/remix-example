import { ClientLoaderFunctionArgs, Link, useLoaderData, useParams } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/node';
import invariant from "tiny-invariant";
import type { Post } from '~/type';
import { useQuery } from '@tanstack/react-query';

export const loader = async ({ params }: LoaderFunctionArgs): Promise<Post> => {
  invariant(params.postId, 'postId is required');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { id: params.postId, title: `Post ${params.postId} from server loader` };
}

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs): Promise<Post> => {
  invariant(params.postId, 'postId is required');
  return { id: params.postId, title: `Post ${params.postId} from client loader` };
}

export default function Post() {
  const params = useParams<{ postId: string; }>();
  const post = useLoaderData<typeof loader>();

  const { data } = useQuery({
    initialData: post,
    staleTime: 0,
    queryKey: ['posts', params.postId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id: params.postId, title: `Post ${params.postId} from client query`};
    }
  });

  return (
    <div className="p-24">
      <div className="text-2xl mb-4">
        <Link to="/">Go to home</Link>
      </div>
      <div>Loader title: {post.title}</div>
      <div>Query title: {data.title}</div>
    </div>
  )
}
