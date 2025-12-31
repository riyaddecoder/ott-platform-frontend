'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCategoryStore } from '../../services/category';
import Button from '../../components/common/Button';

export default function CategoryPage() {
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async () => {
    if (newCategoryName.trim()) {
      await createCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleEdit = (category: { id: number; name: string }) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleUpdate = async () => {
    if (editingId && editingName.trim()) {
      await updateCategory(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
  };

  return (
    <main className="min-h-screen bg-white p-4">
      <Link href="/" className="text-blue-500 hover:text-blue-700 mb-4 inline-flex items-center gap-2 transition-colors">
        <ArrowLeft size={16} />
        Back to Home
      </Link>
      <h1 className="text-2xl font-bold mb-4">Category Page</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="mb-6 max-w-4xl">
        <h2 className="text-xl font-semibold mb-2">Add New Category</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="border px-3 py-2 rounded-md flex-1"
          />
          <Button onClick={handleCreate} disabled={loading}>
            Add
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        {loading && <p>Loading...</p>}
        {!loading && categories.length === 0 && <p>No categories found.</p>}
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id} className="border p-3 rounded-md flex justify-between items-center">
              {editingId === category.id ? (
                <div className="flex gap-2 flex-1">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border px-3 py-2 rounded-md flex-1"
                  />
                  <Button onClick={handleUpdate} disabled={loading}>
                    Save
                  </Button>
                  <Button onClick={() => setEditingId(null)} className="bg-gray-500 hover:bg-gray-600">
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(category)} disabled={loading}>
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(category.id)} disabled={loading} className="bg-red-500 hover:bg-red-600">
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
