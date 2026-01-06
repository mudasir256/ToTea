'use client'

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  backgroundImage?: string
}

export default function PageHeader({ title, subtitle, description, backgroundImage }: PageHeaderProps) {
  return (
    <section className="relative pt-24 h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Background with image or gradient */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
            <div className="absolute inset-0 bg-primary-900/30"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>
            <div className="absolute inset-0 bg-primary-900/20"></div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 md:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-2 sm:mb-3 md:mb-4 drop-shadow-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white/95 mb-2 sm:mb-3 md:mb-4 drop-shadow-xl px-2">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 max-w-2xl mx-auto drop-shadow-lg px-4 sm:px-6">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}

