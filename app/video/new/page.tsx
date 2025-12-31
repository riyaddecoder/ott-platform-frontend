"use client";

import { useVideoStore } from "@/services/video";
import { useCategoryStore } from "@/services/category";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewVideoPage() {
  const router = useRouter();
  const { createVideo, loading } = useVideoStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    duration: "",
    category_id: "",
    thumbnail: null as File | null,
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, thumbnail: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.thumbnail) {
      alert("Please select a thumbnail");
      return;
    }
    try {
      await createVideo({
        title: formData.title,
        description: formData.description,
        url: formData.url,
        duration: formData.duration,
        category_id: parseInt(formData.category_id),
        thumbnail: formData.thumbnail,
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to create video:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <Link
        href="/"
        className="text-blue-500 hover:text-blue-700 mb-4 inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <h1 className="text-2xl font-bold mb-4">Add New Video</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded h-24"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Video URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Thumbnail</label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Video"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
