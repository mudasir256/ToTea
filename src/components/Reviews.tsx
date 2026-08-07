import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getSupabase } from "@/lib/supabase";
import type { Review } from "@/types/database";

function clampRating(rating: number) {
  if (!Number.isFinite(rating)) return 0;
  return Math.max(0, Math.min(5, Math.round(rating)));
}

function formatName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "T";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
  const value = clampRating(rating);

  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={15}
          strokeWidth={1.5}
          className={
            index < value
              ? "fill-accent text-accent"
              : "fill-transparent text-border"
          }
        />
      ))}
    </div>
  );
}

export const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      const supabase = getSupabase();
      if (!supabase) {
        if (!cancelled) {
          setError("Supabase is not configured");
          setLoading(false);
        }
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("id, reviewer_name, rating, description")
        .order("created_at", { ascending: false })
        .limit(24);

      if (cancelled) return;

      if (fetchError) {
        console.error("Unable to load reviews", fetchError);
        setError(fetchError.message);
        setReviews([]);
      } else {
        setError(null);
        setReviews((data ?? []) as Review[]);
      }
      setLoading(false);
    }

    void loadReviews();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!api) return;

    const sync = () => {
      setCurrent(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);

    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  useEffect(() => {
    if (!api || reviews.length < 2) return;

    const timer = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [api, reviews.length]);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
      : 0;

  return (
    <section className="section-padding relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 0%, hsl(35 90% 55% / 0.09), transparent 70%)",
        }}
      />

      <div className="container relative mx-auto px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid items-end gap-8 lg:mb-16 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-4 inline-block text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Guest Love
              </span>
              <h2 className="heading-lg mb-4">
                What people <span className="text-gradient">say</span>
              </h2>
              <p className="body-lg max-w-xl text-muted-foreground">
                Soft lights, better drinks, and the kind of feedback that keeps us brewing.
              </p>
            </motion.div>

            {!loading && !error && reviews.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="flex items-center gap-5 rounded-3xl border border-border bg-card p-5 shadow-soft lg:justify-end"
              >
                <div className="text-left">
                  <p className="font-serif text-4xl font-semibold tracking-tight text-foreground">
                    {averageRating.toFixed(1)}
                  </p>
                  <div className="mt-1">
                    <StarRating rating={averageRating} />
                  </div>
                </div>
                <div className="h-12 w-px bg-border" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {reviews.length} guest review{reviews.length === 1 ? "" : "s"}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Fresh from our community
                  </p>
                </div>
              </motion.div>
            ) : null}
          </div>

          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading reviews…</span>
            </div>
          ) : error ? (
            <p className="rounded-3xl border border-border bg-card px-6 py-10 text-center text-muted-foreground">
              Reviews are temporarily unavailable.
            </p>
          ) : reviews.length === 0 ? (
            <p className="rounded-3xl border border-border bg-card px-6 py-10 text-center text-muted-foreground">
              Be the first to leave a review after your next visit.
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <Carousel
                setApi={setApi}
                opts={{ align: "start", loop: true }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 md:-ml-6">
                  {reviews.map((review, index) => (
                    <CarouselItem
                      key={review.id}
                      className="pl-4 md:basis-1/2 md:pl-6 xl:basis-1/3"
                    >
                      <article
                        className={`flex h-full min-h-[280px] flex-col rounded-[1.75rem] border p-7 transition-all duration-500 md:p-8 ${
                          current === index
                            ? "border-accent/35 bg-card shadow-elevated"
                            : "border-border bg-card/80 shadow-soft"
                        }`}
                      >
                        <div className="mb-6 flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
                            <Quote size={18} className="text-accent" />
                          </div>
                          <StarRating rating={Number(review.rating)} />
                        </div>

                        <blockquote className="flex-1 text-[1.05rem] leading-relaxed text-foreground/90">
                          “{review.description}”
                        </blockquote>

                        <div className="mt-8 flex items-center gap-3 border-t border-border/70 pt-5">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                            {initialsFor(review.reviewer_name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">
                              {formatName(review.reviewer_name)}
                            </p>
                            <p className="text-sm text-muted-foreground">Totea guest</p>
                          </div>
                        </div>
                      </article>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {reviews.length > 1 ? (
                <div className="mt-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {reviews.map((review, index) => (
                      <button
                        key={review.id}
                        type="button"
                        aria-label={`Go to review ${index + 1}`}
                        aria-current={current === index}
                        onClick={() => api?.scrollTo(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          current === index
                            ? "w-8 bg-accent"
                            : "w-2 bg-border hover:bg-muted-foreground/35"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={scrollPrev}
                      disabled={!canScrollPrev && reviews.length < 2}
                      aria-label="Previous reviews"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-accent/40 hover:shadow-soft disabled:opacity-40"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={scrollNext}
                      disabled={!canScrollNext && reviews.length < 2}
                      aria-label="Next reviews"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-accent/40 hover:shadow-soft disabled:opacity-40"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
