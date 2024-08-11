import { json, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Post } from '~/type';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
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
  return [
    { id: '1', title: 'Post 1 from client loader' },
    { id: '2', title: 'Post 2 from client loader' },
    { id: '3', title: 'Post 3 from client loader' },
  ]
}

export default function Index() {
  const posts = useLoaderData<typeof loader>();

  return (
    <div className="font-sans p-24">
      <h1 className="text-2xl mb-4">
        Home Page
      </h1>
      <div className="flex flex-col">
        {posts.map(p => (
          <Link className="underline" to={`/posts/${p.id}`} key={p.id}>
            {p.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
