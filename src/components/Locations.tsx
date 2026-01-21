import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { ScrollLink } from '@/components/ScrollLink';
import { locations } from '@/data/menu';

interface LocationsProps {
  hideHeader?: boolean;
}

export const Locations = ({ hideHeader = false }: LocationsProps) => {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          {!hideHeader && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
            <span className="inline-block text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Visit Us
            </span>
            <h2 className="heading-lg mb-6">
              Find Your Nearest <span className="text-gradient">Totea</span>
            </h2>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              Visit us at one of our locations across Northern Virginia
            </p>
          </motion.div>
          )}

          {/* Locations Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <motion.div
                key={location.city}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="location-card group"
              >
                {/* City Name */}
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-accent" />
                  <h3 className="text-xl font-serif font-semibold">{location.city}</h3>
                </div>

                {/* Address */}
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {location.address}
                </p>

                {/* Hours */}
                <div className="flex items-start gap-2 mb-4">
                  <Clock size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    <p>{location.hours.weekday}</p>
                    {location.hours.sunday && <p>{location.hours.sunday}</p>}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 mb-6">
                  <Phone size={16} className="text-muted-foreground" />
                  <a
                    href={`tel:${location.phone}`}
                    className="text-sm text-foreground hover:text-accent transition-colors"
                  >
                    {location.phone}
                  </a>
                </div>

                {/* Order Button */}
                <ScrollLink
                  to="/order"
                  className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
                >
                  Order Online
                  <ExternalLink size={16} />
                </ScrollLink>
              </motion.div>
            ))}
          </div>

          {/* Late Night Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 p-8 md:p-12 rounded-4xl bg-primary text-primary-foreground text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <span className="text-4xl">🌙</span>
              <h3 className="text-2xl md:text-3xl font-serif font-semibold">
                Late Night Every Night!
              </h3>
            </div>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">
              Most locations open until midnight or later. Perfect for your late-night
              bubble tea cravings!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
              <span className="px-4 py-2 rounded-full bg-primary-foreground/10 text-sm font-medium">
                Extended Hours
              </span>
              <span className="px-4 py-2 rounded-full bg-primary-foreground/10 text-sm font-medium">
                Multiple Locations
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
