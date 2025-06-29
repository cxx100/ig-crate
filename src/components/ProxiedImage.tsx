"use client";

import { useState, useRef } from 'react';
import { createFallbackImageSrc, type ImageProxyOptions } from '@/lib/image-proxy';

interface ProxiedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackContent?: React.ReactNode;
  options?: ImageProxyOptions;
  onLoad?: () => void;
  onError?: () => void;
}

export function ProxiedImage({ 
  src, 
  alt, 
  className = '', 
  fallbackContent,
  options = {},
  onLoad,
  onError
}: ProxiedImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const urlsRef = useRef<string[]>([]);

  // 生成备选URL列表
  if (urlsRef.current.length === 0) {
    urlsRef.current = createFallbackImageSrc(src, options);
    console.log('Generated fallback URLs:', urlsRef.current);
  }

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    console.log(`Image failed to load: ${urlsRef.current[currentIndex]}`);
    
    // 如果还有其他URL可以尝试
    if (currentIndex < urlsRef.current.length - 1) {
      setCurrentIndex(currentIndex + 1);
      console.log(`Trying next URL: ${urlsRef.current[currentIndex + 1]}`);
    } else {
      // 所有URL都失败了
      setIsLoading(false);
      setHasError(true);
      onError?.();
    }
  };

  if (hasError && fallbackContent) {
    return <>{fallbackContent}</>;
  }

  return (
    <>
      <img
        src={urlsRef.current[currentIndex]}
        alt={alt}
        className={className}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: hasError ? 'none' : 'block' }}
      />
      {isLoading && (
        <div className="animate-pulse bg-gray-200 w-full h-full flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </>
  );
}