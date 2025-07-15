"use client";
// This file is a client component because it uses hooks like useUser and useMutation

import React from "react";
import { availablePlans } from "@/lib/plans";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price / 100);
};

type SubscribeResponse = {
  url: string;
}

type SubscribeError = {
  error: string; 
}



const Subscribe = () => {

  const {user} = useUser();
  const router = useRouter();
  const userId = user?.id || "";
  const email = user?.emailAddresses[0]?.emailAddress || "";

 
  const {mutate, isPending} = useMutation<SubscribeResponse, Error, string>({
    mutationFn: async (planName: string) => {
      // get the plan ID from the plan name

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planName, userId, email }),
      });

      if (!response.ok) {
        const errorData: SubscribeError = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data: SubscribeResponse = await response.json();
      return data;
    },
    onMutate: () => {
      toast.info("Processing your subscription...");
    },
    onSuccess: (data) => {
      toast.success("Redirecting to Checkout...");
      // Redirect to the Stripe checkout page
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubscribe = (planName: string) => {
    if (!userId){
      router.push("/sign-up");
      return;
    }
    mutate(planName);
  };
  
  if (!userId || !email) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Please sign in to subscribe</h2>
        <p className="text-gray-600">You need to be signed in to access subscription plans.</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600 mb-12">
          Flexible options for individuals, pros, and families.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {availablePlans.map((plan, index) => {
            const isPopular = plan.isPopular;

            return (
              <div
                key={index}
                className={`relative rounded-xl shadow-lg p-8 bg-white flex flex-col justify-between transition transform hover:scale-105 duration-300 ${
                  isPopular
                    ? "border-4 border-blue-600 z-10"
                    : "border border-gray-200"
                }`}
              >
                {/* Most Popular Badge */}
                {isPopular && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md uppercase">
                    Most Popular
                  </div>
                )}

                {/* Header */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-4xl font-extrabold text-gray-900">
                    {formatPrice(plan.price, plan.currency)}
                  </p>
                  <p className="text-gray-500 text-sm">/ {plan.interval}</p>
                </div>

                {/* Features */}
                <ul className="text-left space-y-3 mb-6 text-gray-700">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 font-bold mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`cursor-pointer mt-auto w-full py-3 px-6 rounded-lg text-white font-semibold ${
                    isPopular
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-800"
                  } transition duration-300`}

                  onClick={() => handleSubscribe(plan.name)}
                  disabled={isPending} 
                >
                  {isPending ? "Processing..." : "Subscribe Now"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
