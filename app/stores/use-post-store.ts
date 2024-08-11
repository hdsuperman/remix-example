import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Post } from '~/type';

export function selectByIds<T = never>(
  ids: string[],
  entities: { [key: string]: T | undefined }
): T[] {
  const arr: T[] = [];
  for (let i = 0, len = ids.length; i < len; i++) {
    const item = entities[ids[i]];
    if (item) arr.push(item);
  }
  return arr;
}

interface Store {
  ids: string[];
  entities: Record<string, Post | undefined>;
  setPost: (post: Post) => void;
  setPosts: (posts: Post[]) => void;
}

export const usePostStore = create(
  immer<Store>(set => ({
    ids: [],
    entities: {},
    setPost: post =>
      set(state => {
        state.entities[post.id] = post;
        if (state.ids.includes(post.id)) return;
        state.ids = Array.from(new Set([post.id].concat(state.ids)));
      }),
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

export function usePosts() {
  return usePostStore(state => selectByIds(state.ids, state.entities));
}

export function usePostById(postId: string): Post | undefined {
  return usePostStore(state => state.entities[postId]);
}
