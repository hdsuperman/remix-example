import { json, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Post } from '~/type';
import { useQuery } from '@tanstack/react-query';
import { selectByIds, usePosts, usePostStore } from '~/stores/use-post-store';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return json<Post[]>([
    { id: '1', title: 'Post 1 from server loader' },
    { id: '2', title: 'Post 2 from server loader' },
    { id: '3', title: 'Post 3 from server loader' },
  ]);
}

export const clientLoader = async () => {
  const state = usePostStore.getState();
  return state.ids.map(id => ({ id, title: `Post ${id} from client loader` }))
}

export default function Index() {
  const setPosts = usePostStore((s) => s.setPosts);
  const postListFromLoader = useLoaderData<typeof loader>();

  useQuery({
    staleTime: 0,
    initialData: postListFromLoader,
    queryKey: ['posts'],
    queryFn: async () => {
      console.log('Fetching post list')
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res: Post[] = [
        { id: '1', title: 'Post 1 from client query' },
        { id: '2', title: 'Post 2 from client query' },
        { id: '3', title: 'Post 3 from client query' },
      ];
      setPosts(res);
      return res;
    },
  });

  const postsFromStore = usePosts();
  const postList = postsFromStore.length === 0 ? postListFromLoader : postsFromStore;

  return (
    <div className="font-sans p-24">
      <h1 className="text-2xl mb-4">
        Home Page
      </h1>
      <div>
        <div className="flex flex-col items-start">
          {postListFromLoader.map(p => (
            <Link className="underline" to={`/posts/${p.id}`} key={p.id}>
              {p.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-start pt-4">
          {postList.map(p => (
            <Link className="underline" to={`/posts/${p.id}`} key={p.id}>
              {p.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
