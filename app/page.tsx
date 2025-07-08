import Link from "next/link";
import { features, testimonials } from "../constant/features";
import { FaStar } from "react-icons/fa";


export default function Home() {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="bg-blue-500 text-white py-20 rounded-4xl">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">AI Meal Planner</h1>
          <p className="text-lg mb-6">Plan your meals effortlessly with AI-powered suggestions.</p>
          <Link href="/sign-up" className="inline-block cursor-pointer">
            <button className="bg-white text-blue-500 px-6 py-2 cursor-pointer rounded-lg font-semibold hover:bg-gray-200">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Section 2: Features */}
      <section className="py-16 text-black px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Features</h2>
          <p className="text-lg text-gray-700 mb-12">
        Discover personalized meal plans, nutritional insights, and more.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-center mb-4">
          <feature.icon className="text-blue-500 w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
          </div>
        </div>
      </section>

      {/* Section 3: Testimonials */}
  <section className="bg-gray-200 py-16 px-5">
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">Testimonials</h2>
      <p className="text-lg text-gray-700 mb-12">
        Hear from our happy users who love their AI meal plans!
      </p>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="relative bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center"
          >
            {/* avatar */}
            <img
              src={t.avatar}
              alt={t.name}
              className="w-20 h-20 rounded-full object-cover -mt-14 mb-4 ring-4 ring-gray-200"
            />

            {/* quote */}
            <p className="text-gray-600 italic mb-6">
              “{t.quote}”
            </p>

            {/* name + title */}
            <div className="text-center">
              <h4 className="font-semibold">{t.name}</h4>
              <span className="text-sm text-gray-500">
                {t.title}
              </span>
            </div>

            {/* stars */}
            <div className="flex gap-1 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < t.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

        {/* Section 4: Contact */}
        <section className="py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="text-lg text-gray-700">
              Have questions? Reach out to us for support and inquiries.
            </p>
          </div>
        </section>
    </div>
  );
}
