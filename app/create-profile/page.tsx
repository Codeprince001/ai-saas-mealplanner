"use client"

import { useUser } from '@clerk/nextjs'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';


type ApiResponse = {
  message: string;
  error: string
}

const CreateProfile = () => {
  const router = useRouter()
  const {isSignedIn, isLoaded} = useUser()
  const {mutate, isPending} = useMutation<ApiResponse, Error>({
    mutationFn: async () => {
      // Call your API to create a profile
      const response = await fetch("/api/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      })

      const data = await response.json()
      return data
    },

    onSuccess: (data) => {
      toast.success(data.message || 'Profile created!');
      // Handle success, e.g., redirect to dashboard or show success message
      router.push("/subscribe")

    },
    onError: (error) => {
      // Handle error, e.g., show error message
      toast.error(error.message || 'Something went wrong');
    }   
  })

  useEffect(() => {
    if (isLoaded && isSignedIn && !isPending){
      mutate()
    }
  }, [isSignedIn, isLoaded])

  return (
    <div>
      Loading
    </div>
  )
}

export default CreateProfile