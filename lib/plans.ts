
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

const PriceIDMap: Record<string, string> = {
  "Basic Plan": process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN!,
  "Pro Plan": process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN!,
  "Family Plan": process.env.NEXT_PUBLIC_STRIPE_FAMILY_PLAN!,
};

export const getPlanIDFromType = (planName: string): string => {
  const priceID = PriceIDMap[planName];
  console.log(`Price ID for ${planName}: ${priceID}`);
  if (!priceID) {
    throw new Error(`Price ID not found for plan: ${planName}`);
  }
  return priceID;
}