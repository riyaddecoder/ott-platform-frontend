"use client";
import Button from "@/components/common/Button";
import { useVideoStore } from "@/services/video";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { videos, fetchVideos } = useVideoStore();

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);
  
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md p-4">
              <img src={`${process.env.NEXT_PUBLIC_URL}storage/${video.thumbnail_path}`} alt={video.title} className="w-full h-48 object-cover rounded-md mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{video.title}</h2>
              <p className="text-gray-600 mb-2">{video.description}</p>
              <div className="text-sm text-gray-500">
                <p>Duration: {video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
