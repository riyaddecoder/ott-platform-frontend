"use client";
import Button from "@/components/common/Button";
import { useVideoStore } from "@/services/video";
import { useCategoryStore } from "@/services/category";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { videos, total, fetchVideos, lastPage } = useVideoStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const limit = 10;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '';
    const page = parseInt(searchParams.get('page') || '1');
    setSelectedCategory(category);
    setSelectedSort(sort);
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    const params: { category?: string; sort?: string; page?: number; limit?: number } = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSort) params.sort = selectedSort;
    params.page = currentPage;
    params.limit = limit;
    fetchVideos(params);
  }, [fetchVideos, selectedCategory, selectedSort, currentPage]);

  const updateURL = (category: string, sort: string, page: number = 1) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setCurrentPage(1);
    updateURL(category, selectedSort, 1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    setSelectedSort(sort);
    setCurrentPage(1);
    updateURL(selectedCategory, sort, 1);
  };
  
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Videos</h1>
          <div className="space-x-4">
            <Link href="/category">
              <Button>
                Manage Categories
              </Button>
            </Link>

            <Link href="/video/new">
              <Button>
                Add New Video
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Category:</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sort:</label>
            <select
              value={selectedSort}
              onChange={handleSortChange}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Default</option>
              <option value="latest">Latest</option>
            </select>
          </div>
        </div>
        {total > 5 && (
          <div className="mb-4 text-sm text-gray-600">
            Total videos: {total}
          </div>
        )}
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first video.</p>
            <Link href="/video/new">
              <Button>Add New Video</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link key={video.id} href={`/video/${video.id}`}>
                <div className="bg-white rounded-lg shadow-md p-4 hover:cursor-pointer hover:shadow-lg transition-shadow">
                  <img src={`${process.env.NEXT_PUBLIC_URL}storage/${video.thumbnail_path}`} alt={video.title} className="w-full h-48 object-cover rounded-md mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{video.title}</h2>
                  <p className="text-gray-600 mb-2">{video.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>Duration: {video.duration}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {total > limit && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const newPage = Math.max(1, currentPage - 1);
                  setCurrentPage(newPage);
                  updateURL(selectedCategory, selectedSort, newPage);
                }}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2">Page {currentPage} of {Math.ceil(total / limit)}</span>
              <Button
                onClick={() => {
                  const newPage = Math.min(lastPage, currentPage + 1);
                  setCurrentPage(newPage);
                  updateURL(selectedCategory, selectedSort, newPage);
                }}
                disabled={currentPage >= lastPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
