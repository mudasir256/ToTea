'use client'

import { MapPin, Clock, ExternalLink } from 'lucide-react'

interface Location {
  name: string
  address: string
  hours: {
    weekdays: string
    sunday: string
  }
  phone?: string
}

const locations: Location[] = [
  {
    name: 'Falls Church, VA',
    address: '123 Main Street, Falls Church, VA 22046',
    hours: {
      weekdays: 'Mon - Sat: 7:00 AM - 12:00 AM',
      sunday: 'Sunday: 7:00 AM - 9:00 PM',
    },
    phone: '(703) 555-0100',
  },
  {
    name: 'Fairfax, VA',
    address: '456 University Drive, Fairfax, VA 22030',
    hours: {
      weekdays: 'Mon - Sat: 9:00 AM - 12:00 AM',
      sunday: 'Sunday: 9:00 AM - 9:00 PM',
    },
    phone: '(703) 555-0101',
  },
  {
    name: 'Vienna, VA',
    address: '789 Maple Avenue, Vienna, VA 22180',
    hours: {
      weekdays: 'Mon - Sun: 9:00 AM - 10:00 PM',
      sunday: '',
    },
    phone: '(703) 555-0102',
  },
  {
    name: 'Sterling, VA',
    address: '321 Commerce Street, Sterling, VA 20164',
    hours: {
      weekdays: 'Mon - Sat: 9:00 AM - 12:00 AM',
      sunday: 'Sunday: 9:00 AM - 9:00 PM',
    },
    phone: '(703) 555-0103',
  },
]

export default function Locations() {
  return (
    <section id="locations" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Nearest ToTea
          </h2>
          <p className="text-xl text-gray-600">
            Visit us at one of our locations across Northern Virginia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((location, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{location.name}</h3>
                    <p className="text-gray-600 mt-1">{location.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 font-medium">{location.hours.weekdays}</p>
                    {location.hours.sunday && (
                      <p className="text-gray-700 font-medium">{location.hours.sunday}</p>
                    )}
                  </div>
                </div>
                {location.phone && (
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">Phone:</span>
                    <a href={`tel:${location.phone}`} className="text-primary-500 hover:text-primary-600 font-medium">
                      {location.phone}
                    </a>
                  </div>
                )}
              </div>

              <a
                href="#order"
                className="inline-flex items-center space-x-2 bg-primary-400 text-white px-6 py-3 rounded-full hover:bg-primary-500 transition-colors font-medium shadow-md"
              >
                <span>Order Online</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-primary-50 to-tea-light rounded-2xl p-8 max-w-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Late Night Every Night!</h3>
            <p className="text-gray-700 mb-6">
              Most locations open until midnight or later. Perfect for your late-night bubble tea cravings!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <span>Extended Hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Multiple Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

