"use client"

import Spinner from '@/components/spinner'
import { availablePlans } from '@/lib/plans'
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import React, { useState } from 'react'
import UnsubscribeModal from '@/components/modal'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Link from 'next/link'



type SubscriptionResponse = {
  subscriptionTier: string
}

type UpdatePlanResponse = {
  success: boolean
  subscriptionTier: string
}

const fetchSubscriptionStatus = async (): Promise<SubscriptionResponse> => {
  const response = await fetch("/api/profile/subscription-status")
  return response.json()
}

const Profile = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const { isLoaded, isSignedIn, user } = useUser()
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    data: updatedPlanData,
    mutate: updatePlanMutation,
    isPending: isUpdatePlanPending
  } = useMutation<UpdatePlanResponse, Error, string>({
    mutationFn: async (newplan: string) => {
      const response = await fetch("/api/profile/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newplan })
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["subscribe"]})
      toast.success("Subscription Plan Updated Successfully")
      refetch()
    },
    onError: () => {
      toast.error("Error updating subscription")
    }
  })


  const {
    mutate: unsubscribeMutation,
    isPending: isUnsubscribePlanPending
  } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/profile/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["subscribe"]})
      router.push("/subscribe")
    },
    onError: () => {
      toast.error("Error Unsubscribing.")
    }
  })

  const handleUpdatePlan = () => {
    if (selectedPlan) {
      updatePlanMutation(selectedPlan)
      setSelectedPlan("")
    }
  }

  const handleUnsubscribe = () => {
     setOpenModal(true)
  }

  const { data: subscriptionStatus, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscriptionStatus,
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000
  })

  const currentPlan = availablePlans.find(
    (plan) => plan.name === subscriptionStatus?.subscriptionTier
  )

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner />
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-lg text-gray-700">Please sign in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
        
        {/* User Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {user.imageUrl && (
            <Image
              src={user.imageUrl}
              alt="user-image"
              width={100}
              height={100}
              className="rounded-full border shadow-sm"
            />
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {user.primaryEmailAddress?.emailAddress}
            </p>
            <p className='text-gray-600 dark:text-gray-300 mt-1'>
              Dummy Master Card: 5555 5555 5555 4444
            </p>
            <p className='text-gray-600 dark:text-gray-300 mt-1'>Use any CVV or Expiring Date</p>
          </div>
        </div>

        {/* Current Subscription */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
            Current Subscription
          </h2>

          {isLoading ? (
            <div className="flex items-center gap-2 mx-auto">
              <Spinner />
              <span className="text-gray-600 dark:text-gray-300">Loading subscription...</span>
            </div>
          ) : isError ? (
            <p className="text-red-500">{error?.message}</p>
          ) : subscriptionStatus ? (
            currentPlan ? (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-2">
                <p className="text-lg text-gray-700 dark:text-gray-200">
                  <span className="font-medium">Plan:</span> {currentPlan.name}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-200">
                  <span className="font-medium">Amount:</span> {currentPlan.currency} {(currentPlan.price / 100).toFixed(2)} / {currentPlan.interval}
                </p>
                <p className="text-green-600 font-medium">Status: ACTIVE ✅</p>
              </div>
            ) : (
              <div>
              <p className="text-yellow-500">Current plan not found in plan list.</p>
              <Link href={isSignedIn ? "/subscribe" : "/sign-up"} className="text-gray-800 hover:text-blue-500">
              <button className='px-6 mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
                Choose Subscription plan
              </button>
              </Link>
            </div>
            )
          ) : (
            <p className="text-gray-500">No subscription data available.</p>
          )}
        </div>

        {/* Change Plan */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Change Subscription Plan
          </h3>
          {currentPlan && (
            <div className="space-y-4">
              <select
                value={selectedPlan}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPlan(e.target.value)}
                disabled={isUpdatePlanPending}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a new plan
                </option>
                {availablePlans.map((plan) => (
                  <option key={plan.name} value={plan.name}>
                    {plan.name} — ${(plan.price / 100).toFixed(2)} / {plan.interval}
                  </option>
                ))}
              </select>

              <button
                onClick={handleUpdatePlan}
                disabled={!selectedPlan || isUpdatePlanPending}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Change
              </button>

              {isUpdatePlanPending && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                  <Spinner />
                  Updating subscription...
                </div>
              )}

              {updatedPlanData?.success && (
                <p className="text-sm text-green-600">Plan updated to {updatedPlanData.subscriptionTier} ✅</p>
              )}
            </div>
          )}
        </div>

       {/* Unsubscribe Section */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Cancel Subscription
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            If you no longer wish to use the service, you can cancel your subscription. You&apos;ll retain access until the end of your billing cycle.
          </p>

          <button
            onClick={handleUnsubscribe}
            disabled={isUnsubscribePlanPending}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUnsubscribePlanPending ? "Unsubscribing..." : "Unsubscribe"}
          </button>
        </div>

         <UnsubscribeModal openModal={openModal} setOpenModal={setOpenModal} unsubscribeMutation={unsubscribeMutation} />
      </div>
    </div>
  )
}

export default Profile