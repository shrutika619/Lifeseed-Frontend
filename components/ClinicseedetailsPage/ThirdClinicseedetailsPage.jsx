"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <-- Yeh add kiya
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "S. Patil",
    text: "The specialists here are true professionals. They listen patiently and provide practical solutions. The clinic environment is clean and discreet, which I really appreciated. My confidence has returned.",
    rating: 5
  },
  {
    id: 2,
    name: "A. Joshi",
    text: "Finding the right doctor was difficult, but I'm glad I chose this clinic. The treatment was effective, and the follow-up care was excellent. I highly recommend this clinic to anyone facing similar issues.",
    rating: 5
  },
  {
    id: 3,
    name: "R. Kumar",
    text: "Professional staff and compassionate care. The doctors took time to explain everything clearly and made me feel comfortable throughout the treatment process. Highly satisfied with the results.",
    rating: 5
  },
  {
    id: 4,
    name: "M. Deshmukh",
    text: "Outstanding experience from consultation to treatment. The clinic maintains high standards of hygiene and privacy. The personalized approach to treatment made all the difference.",
    rating: 5
  }
];

const ThirdClinicseedetailsPage = () => {
  const router = useRouter(); // <-- Router hook
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const goToSlide = (index) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const autoPlay = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(autoPlay);
  }, []);

  // Button click handler - redirect to booking page
  const handleBookAppointment = () => {
    router.push('/bookappointment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      {/* Testimonials Section */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          What Our Patients Say
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Carousel */}
          <div className="overflow-hidden rounded-2xl shadow-2xl bg-white">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="min-w-full p-12"
                >
                  <div className="max-w-3xl mx-auto">
                    {/* Stars */}
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-6 h-6 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-xl text-gray-700 text-center leading-relaxed mb-8 italic">
                      "{testimonial.text}"
                    </p>

                    {/* Author */}
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-12 h-3 bg-blue-600'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">
          Ready to Take the Next Step?
        </h2>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Begin your journey towards better health and confidence. Book your<br />
          confidential consultation today.
        </p>
        <button 
          onClick={handleBookAppointment} // <-- Yeh handler add kiya
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-10 py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          Book My Appointment Now
        </button>
      </div>
    </div>
  );
};

export default ThirdClinicseedetailsPage;