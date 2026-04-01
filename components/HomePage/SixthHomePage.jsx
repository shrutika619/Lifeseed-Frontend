import React from "react";
import { Play, Baby, Heart, Users } from "lucide-react";

const testimonials = [
  {
    name: "Priya S.",
    location: "Mumbai",
    quote:
      '"After 3 years of trying, LifeSeed gave us hope. The doctors were so supportive and our IVF journey was handled with such care. We are now blessed with a baby girl!"',
    author: "P. Sharma, Mumbai",
    icon: Baby,
    bg: "from-pink-50 to-rose-100",
    border: "border-rose-200",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-400",
    textColor: "text-rose-300",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-400",
    playColor: "text-rose-400",
  },
  {
    name: "Rahul & Sneha M.",
    location: "Pune",
    quote:
      '"LifeSeed\'s counselling and fertility assessment helped us understand our options clearly. The team was always available and the entire process felt very personal and professional."',
    author: "R. & S. Mehta, Pune",
    icon: Users,
    bg: "from-blue-50 to-blue-100",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-400",
    textColor: "text-blue-300",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-400",
    playColor: "text-blue-400",
  },
  {
    name: "Kavita R.",
    location: "Bangalore",
    quote:
      '"I had almost given up on becoming a mother. LifeSeed\'s expert team guided me through every step of the IVF process with compassion. Today I am a proud mother of twins!"',
    author: "K. Rao, Bangalore",
    icon: Heart,
    bg: "from-purple-50 to-purple-100",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-400",
    textColor: "text-purple-300",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-400",
    playColor: "text-purple-400",
  },
];

const SixthHomePage = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-20">
      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Hear From Our{" "}
          <span className="text-blue-700">Happy Families</span>
        </h2>
        <p className="mt-2 text-gray-500 text-sm md:text-base">
          Real stories from real patients who trusted LifeSeed on their fertility journey.
        </p>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t, index) => {
          const IconComponent = t.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-col border ${t.border}`}
            >
              {/* Thumbnail - faint pastel */}
              <div className={`relative bg-gradient-to-br ${t.bg} flex flex-col items-center justify-center h-44 gap-3 border-b ${t.border}`}>
                
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 ${t.iconBg} rounded-full flex items-center justify-center border border-opacity-30 ${t.border}`}>
                    <IconComponent size={28} className={t.iconColor} />
                  </div>
                  <span className={`font-bold text-lg tracking-wide ${t.iconColor}`}>
                    LifeSeed
                  </span>
                  <span className={`text-xs font-medium ${t.badgeBg} ${t.badgeText} px-3 py-1 rounded-full border ${t.border}`}>
                    {t.name} · {t.location}
                  </span>
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-end justify-end p-3">
                  <div className={`w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm border ${t.border}`}>
                    <Play size={16} className={`${t.playColor} ml-0.5`} />
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="p-6 text-center flex flex-col justify-between flex-grow">
                <p className="text-gray-600 text-sm italic">{t.quote}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${t.iconBg} flex items-center justify-center`}>
                    <IconComponent size={14} className={t.iconColor} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">- {t.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SixthHomePage;