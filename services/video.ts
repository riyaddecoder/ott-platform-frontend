import { create } from 'zustand';
import { ApiResponse } from './common';

export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  duration: string;
  category_id: number;
  thumbnail: string;
  thumbnail_path?: string;
}

export interface CreateVideoData {
  title: string;
  description: string;
  url: string;
  duration: string;
  category_id: number;
  thumbnail: File;
}

interface VideoStore {
  videos: Video[];
  loading: boolean;
  error: string | null;
  fetchVideos: (params?: { category?: string; sort?: string }) => Promise<void>;
  createVideo: (data: CreateVideoData) => Promise<void>;
}

const fetchVideosApi: (params?: { category?: string; sort?: string }) => Promise<ApiResponse<Video[]>> = async (params) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}videos/`);
  if (params?.category) url.searchParams.set('category', params.category);
  if (params?.sort) url.searchParams.set('sort', params.sort);
  const res = await fetch(url.toString());
  return res.json();
};

const createVideoApi: (data: CreateVideoData) => Promise<Video> = async (data) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('url', data.url);
  formData.append('duration', data.duration);
  formData.append('category_id', data.category_id.toString());
  formData.append('thumbnail', data.thumbnail);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}videos/`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
};

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  loading: false,
  error: null,
  fetchVideos: async (params) => {
    try {
      set({ loading: true, error: null });
      const videos = await fetchVideosApi(params);
      set({ videos: videos.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch videos', loading: false });
    }
  },
  createVideo: async (data) => {
    try {
      set({ loading: true, error: null });
      const newVideo = await createVideoApi(data);
      const videos = get().videos;
      set({ videos: [...videos, newVideo], loading: false });
    } catch (error) {
      set({ error: 'Failed to create video', loading: false });
      throw error;
    }
  },
}));
