"use client"

import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs'

const Navbar = () => {
  const {isLoaded, user, isSignedIn} = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <nav className="flex justify-between items-center p-3 bg-white shadow-md">
      <div className="flex items-center">
      <Link href="/">
        <Image
        src="/logo.png"
        alt="Logo"
        width={50}
        height={50}
        className="cursor-pointer"
        />
      </Link>
      </div>

      <div className="flex items-center space-x-6">
      <SignedIn>
        <div className="flex items-center space-x-6">
        <Link href="/mealplan" className="text-gray-800 hover:text-blue-500">
          Meal Plan
        </Link>
        <Link href="/profile" className="text-gray-800 hover:text-blue-500">
          Profile
        </Link>
        </div>

        <div className="flex items-center space-x-4">
        {user?.imageUrl ? (
          <Link href="/profile">
          <Image
            src={user.imageUrl}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full border border-gray-300 cursor-pointer"
          />
          </Link>
        ) : (
          <Image
          src="/default-avatar.avif"
          alt="Default Avatar"
          width={40}
          height={40}
          className="rounded-full border border-gray-300"
          />
        )}
        <SignOutButton>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Sign Out
          </button>
        </SignOutButton>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex items-center space-x-2">
        <Link href="/" className="text-gray-800 hover:text-blue-500">
          Home
        </Link>
        <Link href={isSignedIn ? "/subscribe" : "/sign-up"} className="text-gray-800 hover:text-blue-500">
          Subscribe
        </Link>
        <Link href="/sign-up" className="text-gray-800 hover:text-blue-500">
          Sign Up
        </Link>
        </div>
      </SignedOut>
      </div>
    </nav>
  )
}

export default Navbar