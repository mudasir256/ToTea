import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="mx-auto max-w-[1100px] px-4 pt-5 md:px-8">
      <div className="relative flex h-[420px] items-end overflow-hidden rounded-[14px] md:h-[520px]"
        style={{ background: "linear-gradient(135deg,#7a5738,#3a281a)" }}
      >
        {/* Fallback plane until a muted looping brew/pour video is available */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=1600&q=80')",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-[520px] p-8 text-white md:p-10"
        >
          <h1 className="mb-2.5 font-serif text-[30px] font-semibold leading-[1.15] md:text-[34px]">
            Made slow, on purpose.
          </h1>
          <p className="text-[14px] leading-[1.6] text-white/85">
            Vietnamese beans bought direct from farmers, matcha from Japan&apos;s first
            harvest, sugarcane pressed fresh every morning. Nothing here comes from a
            powder.
          </p>
        </motion.div>

        <div className="absolute bottom-5 right-6 z-10 flex items-center gap-2 text-[11px] text-white/80 md:right-8">
          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
          scroll to explore
        </div>
      </div>
    </section>
  );
};
