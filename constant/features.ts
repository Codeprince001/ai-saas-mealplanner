import { FaRegCalendarCheck, FaLeaf, FaChartLine } from "react-icons/fa";

export interface Testimonial {
  avatar: string;          // remote or local image path
  name: string;
  title: string;           // e.g. “Nutritionist” or “Busy Parent”
  quote: string;
  rating: number;          // 1–5
}

export interface Feature {
  icon: any;
  title: string;
  description: string
}

export const features: Feature[] = [
  {
    icon: FaRegCalendarCheck,
    title: "Smart Meal Scheduling",
    description:
      "Let the AI arrange breakfast, lunch, and dinner around your calendar, calories, and macros—no repeats, no guesswork.",
  },
  {
    icon: FaLeaf,
    title: "Adaptive Nutrition Insights",
    description:
      "Real‑time macro & micronutrient breakdowns for every recipe, plus evidence‑based tips that evolve with your dietary needs.",
  },
  {
    icon: FaChartLine,
    title: "Progress‑Driven Adjustments",
    description:
      "Connect your wearable or health app; the planner auto‑tunes portions and recipes as your weight, steps, and goals change.",
  },
];



export const testimonials: Testimonial[] = [
  {
    avatar:
      "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Amara Johnson",
    title: "Marathon Runner",
    quote:
      "The AI planner nails my macros every week. I spend 5 minutes on Sunday and never worry about meals again.",
    rating: 5,
  },
  {
    avatar:
      "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Lucas Fernández",
    title: "Busy Dad of 3",
    quote:
      "Dinner used to be chaos. Now we have a rotating meal lineup the kids actually finish — and it fits our budget.",
    rating: 4,
  },
  {
    avatar:
      "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Sofia van Dijk",
    title: "Registered Dietitian",
    quote:
      "Love how the planner adapts to my clients’ dietary restrictions in seconds. It’s become my secret weapon.",
    rating: 5,
  },
];

export interface Plan {
  name: string;
  price: number; // in cents
  currency: string; // e.g. "USD"
  interval: string;
  isPopular?: boolean; // optional, used for highlighting popular plans
  features: string[]; // list of features included in the plan
  description?: string; // optional, additional details about the plan
}

export const availablePlans: Plan[] = [
  {
    name: "Basic Plan",
    price: 999, // $9.99
    currency: "USD",
    interval: "month",
    features: [
      "Access to basic meal planning features",
      "Weekly meal suggestions",
      "Nutritional insights",
    ],
    description: "Perfect for individuals looking to simplify their meal planning.",
  },
  {
    name: "Pro Plan",
    price: 1999, // $19.99
    currency: "USD",
    interval: "month",
    isPopular: true,
    features: [
      "All Basic Plan features",
      "Advanced meal customization",
      "Integration with fitness trackers",
      "Priority support",
    ],
    description: "Ideal for health enthusiasts who want more control over their meals.",
  },
  {
    name: "Family Plan",
    price: 2999, // $29.99
    currency: "USD",
    interval: "month",
    features: [
      "All Pro Plan features",
      "Up to 5 family members included",
      "Family meal planning tools",
      "Shared grocery lists",
    ],
    description: "Great for families who want to plan meals together and save time.",
  },
];

