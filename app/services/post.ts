import axios from 'axios';
import { Post } from '@/type';

export async function getById(id: string) {
  const res = await axios.get<Post>(`/v1/posts/${id}`);
  return res.data;
}
