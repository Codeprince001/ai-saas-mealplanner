"use client"

import { useUser } from '@clerk/nextjs'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Logo from "@/public/logo.png"


type ApiResponse = {
  message: string;
  error: string
}

const CreateProfile = () => {
  const router = useRouter()
  const {isSignedIn, isLoaded} = useUser()
  const hasRunRef = useRef(false);

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
    if (isLoaded && isSignedIn && !isPending || hasRunRef.current){

      
  hasRunRef.current = true;
      mutate()
    }
  }, [isSignedIn, isLoaded])

  return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-background">
      <Loader2 className="w-12 h-12 animate-spin text-primary"/>
      <Image src={Logo} alt="Logo" width={54} height={54} />
      <p className="text-sm text-muted-foreground">Just a moment while we set things up...</p>
    </div>
  )
}

export default CreateProfile