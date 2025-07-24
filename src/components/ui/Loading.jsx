import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ type = "page", className }) => {
  if (type === "table") {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse" 
                 style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" 
                   style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3 animate-pulse" 
                   style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            </div>
            <div className="w-20 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" 
                 style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          </div>
        ))}
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-3 animate-pulse" 
                     style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 animate-pulse" 
                     style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse" 
                   style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            </div>
          </div>
        ))}
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;