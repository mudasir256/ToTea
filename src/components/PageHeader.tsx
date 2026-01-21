import { motion } from 'framer-motion';

interface PageHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
}

export const PageHeader = ({
  badge,
  title,
  subtitle,
}: PageHeaderProps) => {
  return (
    <section className="relative overflow-hidden pt-20 md:pt-24">
      {/* Warm Gradient Background with Theme Colors */}
      <div className="relative bg-gradient-to-br from-accent/15 via-accent/10 to-background py-16 md:py-24">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating gradient orbs */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/3 rounded-full blur-3xl animate-float-delayed" />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/50 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground tracking-wide">
                  {badge}
                </span>
              </motion.div>
            )}

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="heading-lg mb-4 text-foreground"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className="body-lg text-muted-foreground max-w-2xl mx-auto mb-8"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Elegant Decorative Element */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="flex items-center justify-center gap-3 mt-8"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* Soft Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 md:h-16"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80L48 70C96 60 192 40 288 35C384 30 480 40 576 42.5C672 45 768 40 864 37.5C960 35 1056 35 1152 37.5C1248 40 1344 45 1392 47.5L1440 50V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};
