import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MENU_CARD_IMAGE_HEIGHT, MENU_CARD_IMAGE_WIDTH } from "@/lib/menuImageUrl";
import { DEFAULT_MENU_IMAGE } from "@/lib/menuImages";

type MenuCardImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

export function MenuCardImage({
  src,
  alt,
  priority = false,
  className,
  imgClassName,
}: MenuCardImageProps) {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_MENU_IMAGE);

  useEffect(() => {
    setImgSrc(src || DEFAULT_MENU_IMAGE);
  }, [src]);

  return (
    <div className={cn("relative h-[210px] overflow-hidden bg-[#f8f5f0] p-3 flex items-center justify-center", className)}>
      <img
        src={imgSrc}
        alt={alt}
        width={MENU_CARD_IMAGE_WIDTH}
        height={MENU_CARD_IMAGE_HEIGHT}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 340px"
        onError={() => setImgSrc(DEFAULT_MENU_IMAGE)}
        className={cn("h-full w-full object-contain drop-shadow-sm transition-all duration-300 group-hover:scale-105", imgClassName)}
      />
    </div>
  );
}
