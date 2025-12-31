'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useVideoStore } from '../../../services/video';
import { useCategoryStore } from '../../../services/category';

export default function VideoDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const { currentVideo, loading, error, fetchVideoById } = useVideoStore();

  useEffect(() => {
    if (id) {
      fetchVideoById(id);
    }
  }, [id, fetchVideoById]);

  if (loading) return <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center text-red-500">{error}</div>;
  if (!currentVideo) return <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">Video not found</div>;


  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-4 inline-flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} />
          Back to Videos
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6">
          <video controls className="w-full h-100 object-cover rounded-md mb-6">
            <source src={currentVideo.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{currentVideo.title}</h1>
          <p className="text-gray-600 mb-4">{currentVideo.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">Duration</h3>
              <p className="text-gray-600">{currentVideo.duration}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Category</h3>
              <p className="text-gray-600">{currentVideo.category?.name || 'Unknown'}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-800">Video URL</h3>
              <a href={currentVideo.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {currentVideo.url}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
