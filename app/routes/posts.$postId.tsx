import { ClientLoaderFunctionArgs, Link, useLoaderData, useParams } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/node';
import invariant from "tiny-invariant";
import type { Post } from '~/type';
import { useQuery } from '@tanstack/react-query';
import { usePostById, usePostStore } from '~/stores/use-post-store';

export const loader = async ({ params }: LoaderFunctionArgs): Promise<Post> => {
  invariant(params.postId, 'postId is required');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { id: params.postId, title: `Post ${params.postId} from server loader` };
}

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs): Promise<Post> => {
  invariant(params.postId, 'postId is required');
  const state = usePostStore.getState();
  return {
    ...state.entities[params.postId],
    id: params.postId,
    title: `Post ${params.postId} from client loader`
  }
}

export default function Post() {
  const params = useParams<{ postId: string; }>();
  const postFromLoader = useLoaderData<typeof loader>();
  const setPost = usePostStore(s => s.setPost);

  useQuery({
    staleTime: 0,
    initialData: postFromLoader,
    queryKey: ['posts', params.postId],
    queryFn: async () => {
      console.log('Fetching post')
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res: Post = { id: params.postId!, title: `Post ${params.postId} from client query`};
      setPost(res);
      return res;
    }
  });

  const postFromStore = usePostById(params.postId!);
  const post = postFromStore || postFromLoader;

  return (
    <div className="p-24">
      <div className="text-2xl mb-4">
        <Link to="/">Go to home</Link>
      </div>
      <div>Post from loader: {postFromLoader.title}</div>
      <div>Display post: {post.title}</div>
    </div>
  )
}
