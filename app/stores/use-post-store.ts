import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Post } from '~/type';

interface Store {
  ids: string[];
  entities: Record<string, Post | undefined>;
  setPosts: (posts: Post[]) => void;
}

export const usePostStore = create(
  immer<Store>(set => ({
    ids: [],
    entities: {},
    setPosts: posts =>
      set(state => {
        state.ids = posts.map(p => p.id);
        state.entities = posts.reduce((acc, post) => {
          acc[post.id] = post;
          return acc;
        }, state.entities);
      })
  }))
);

export function usePostById(postId: string): Post | undefined {
  return usePostStore(state => state.entities[postId]);
}
