import { create } from 'zustand';
import { ApiResponse } from './common';

export interface Category {
  id: number;
  name: string;
}

interface CategoryStore {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  updateCategory: (id: number, name: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchCategoriesApi: () => Promise<ApiResponse<Category[]>> = async () => {
  const res = await fetch(`${apiUrl}categories/`);
  return res.json();
};

const createCategoryApi: (name: string) => Promise<ApiResponse<Category>> = async (name) => {
  const res = await fetch(`${apiUrl}categories/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

const updateCategoryApi: (id: number, name: string) => Promise<ApiResponse<Category>> = async (id, name) => {
  const res = await fetch(`${apiUrl}categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

const deleteCategoryApi: (id: number) => Promise<ApiResponse<null>> = async (id) => {
  const res = await fetch(`${apiUrl}categories/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetchCategoriesApi();
      if (response.success) {
        set({ categories: response.data, loading: false });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch categories', loading: false });
    }
  },
  createCategory: async (name) => {
    try {
      set({ loading: true, error: null });
      const response = await createCategoryApi(name);
      if (response.success) {
        const newCategory = response.data;
        set((state) => ({ categories: [...state.categories, newCategory], loading: false }));
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to create category', loading: false });
    }
  },
  updateCategory: async (id, name) => {
    try {
      set({ loading: true, error: null });
      const response = await updateCategoryApi(id, name);
      if (response.success) {
        const updatedCategory = response.data;
        set((state) => ({
          categories: state.categories.map(cat => cat.id === id ? updatedCategory : cat),
          loading: false
        }));
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to update category', loading: false });
    }
  },
  deleteCategory: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await deleteCategoryApi(id);
      if (response.success) {
        set((state) => ({
          categories: state.categories.filter(cat => cat.id !== id),
          loading: false
        }));
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to delete category', loading: false });
    }
  },
}));
