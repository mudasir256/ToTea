import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { Product } from '@/data/products';

interface ProductBottleScrollProps {
  product: Product;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ProductBottleScroll = ({ product, containerRef }: ProductBottleScrollProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const frameCount = 200; // Total number of frames

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Transform scroll progress (0-1) to frame index (0-199)
  const frameIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, frameCount - 1]
  );

  // Load all frame images
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Use Vite's glob to import all images (lazy loading)
        const imageModules = import.meta.glob('/src/assets/Headerimg/ezgif-frame-*.jpg', {
          eager: false,
          import: 'default',
        });

        // Sort by frame number
        const sortedKeys = Object.keys(imageModules).sort((a, b) => {
          const frameA = parseInt(a.match(/frame-(\d+)/)?.[1] || '0');
          const frameB = parseInt(b.match(/frame-(\d+)/)?.[1] || '0');
          return frameA - frameB;
        });

        // Load images in order
        const imagePromises = sortedKeys.map(async (path) => {
          try {
            const module = await imageModules[path]();
            const img = new Image();
            return new Promise<HTMLImageElement>((resolve) => {
              img.onload = () => resolve(img);
              img.onerror = () => {
                console.warn(`Failed to load: ${path}`);
                resolve(img); // Resolve anyway to maintain array length
              };
              // Get the image URL from the module
              const imageUrl = typeof module === 'string' 
                ? module 
                : (module as any)?.default || module;
              if (imageUrl) {
                img.src = imageUrl;
              } else {
                resolve(img);
              }
            });
          } catch (err) {
            console.warn(`Error loading ${path}:`, err);
            const img = new Image();
            return Promise.resolve(img);
          }
        });

        const loadedImages = await Promise.all(imagePromises);
        const validImages = loadedImages.filter(
          img => img && img.complete && img.naturalWidth > 0
        );
        
        if (validImages.length > 0) {
          setImages(validImages);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  // Update canvas based on scroll progress
  useEffect(() => {
    if (isLoading || images.length === 0) return;

    const unsubscribe = frameIndex.on('change', (latest) => {
      const frame = Math.floor(latest);
      setCurrentFrame(frame);
    });

    return () => unsubscribe();
  }, [frameIndex, isLoading, images.length]);

  // Draw current frame to canvas
  useEffect(() => {
    if (!canvasRef.current || images.length === 0 || currentFrame >= images.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = images[currentFrame];
    if (!img || !img.complete) return;

    // Set canvas size to match parent container (sticky div)
    const canvasParent = canvas.parentElement;
    let displayWidth = 0;
    let displayHeight = 0;
    
    if (canvasParent) {
      const rect = canvasParent.getBoundingClientRect();
      displayWidth = rect.width;
      displayHeight = rect.height;
      // Use device pixel ratio for crisp rendering on mobile
      const dpr = window.devicePixelRatio || 1;
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      // Scale context to match device pixel ratio
      ctx.scale(dpr, dpr);
      // Set CSS size to actual display size
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
    } else if (containerRef.current) {
      // Fallback to container ref
      const rect = containerRef.current.getBoundingClientRect();
      displayWidth = rect.width;
      displayHeight = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
    }

    if (displayWidth === 0 || displayHeight === 0) return;
    
    // Clear canvas (using display dimensions since context is scaled)
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Check if mobile (< 768px) for different behavior
    const isMobile = window.innerWidth < 768;
    const imgAspect = img.width / img.height;
    const canvasAspect = displayWidth / displayHeight;

    if (isMobile) {
      // Mobile: fit to height, crop width (old behavior)
      let drawWidth = displayWidth;
      let drawHeight = displayHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspect > canvasAspect) {
        // Image is wider - fit to height, crop width
        drawHeight = displayHeight;
        drawWidth = drawHeight * imgAspect;
        offsetX = (displayWidth - drawWidth) / 2;
      } else {
        // Image is taller - fit to height, crop width
        drawHeight = displayHeight;
        drawWidth = drawHeight * imgAspect;
        offsetX = (displayWidth - drawWidth) / 2;
      }

      // Draw image filling the height (using display dimensions since context is scaled)
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } else {
      // Desktop: fit to width, crop height (new behavior - full width edge-to-edge)
      const drawWidth = displayWidth;
      const drawHeight = drawWidth / imgAspect;
      
      // If image is taller than container, crop from source center
      if (drawHeight > displayHeight) {
        const sourceHeight = img.height;
        const sourceWidth = img.width;
        const cropHeight = (sourceWidth / displayWidth) * displayHeight;
        const sourceY = (sourceHeight - cropHeight) / 2;
        
        // Draw with source rectangle cropping (sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(
          img,
          0, sourceY, sourceWidth, cropHeight,  // Source rectangle - crop from center
          0, 0, drawWidth, displayHeight        // Destination rectangle - full width and height
        );
      } else {
        // Image is shorter - center vertically, use full width
        const offsetY = (displayHeight - drawHeight) / 2;
        ctx.drawImage(img, 0, offsetY, drawWidth, drawHeight);
      }
    }
  }, [currentFrame, images, containerRef]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const canvasParent = canvas.parentElement;
        if (canvasParent) {
          const rect = canvasParent.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          ctx.scale(dpr, dpr);
          canvas.style.width = `${rect.width}px`;
          canvas.style.height = `${rect.height}px`;
        } else if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          ctx.scale(dpr, dpr);
          canvas.style.width = `${rect.width}px`;
          canvas.style.height = `${rect.height}px`;
        }
        // Trigger redraw
        setCurrentFrame((prev) => prev);
      }
    };

    window.addEventListener('resize', handleResize);
    // Also listen for orientation change on mobile
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [containerRef]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          objectFit: 'cover',
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
          <div className="text-white text-xl">Loading frames...</div>
        </div>
      )}
    </div>
  );
};
