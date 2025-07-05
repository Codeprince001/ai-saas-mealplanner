import React from 'react'
import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        {/* Clerk SignUp component */}
         <SignUp signInFallbackRedirectUrl={"/subscribe"}/>
      </div>
      </div>
  )
}

export default SignUpPage