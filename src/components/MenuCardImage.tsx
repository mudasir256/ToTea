import { cn } from "@/lib/utils";
import { MENU_CARD_IMAGE_HEIGHT, MENU_CARD_IMAGE_WIDTH } from "@/lib/menuImageUrl";

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
  if (!src) {
    return <div className={cn("relative h-[180px] overflow-hidden bg-[#efe8df]", className)} />;
  }

  return (
    <div className={cn("relative h-[180px] overflow-hidden bg-[#efe8df]", className)}>
      <img
        src={src}
        alt={alt}
        width={MENU_CARD_IMAGE_WIDTH}
        height={MENU_CARD_IMAGE_HEIGHT}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 340px"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
