import { FaRegCalendarCheck, FaLeaf, FaChartLine } from "react-icons/fa";

export interface Testimonial {
  avatar: string;          // remote or local image path
  name: string;
  title: string;           // e.g. “Nutritionist” or “Busy Parent”
  quote: string;
  rating: number;          // 1–5
}

export const features = [
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