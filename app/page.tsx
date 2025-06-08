import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { LearnMore } from "./components/learn-more"
import screenshotDevices from "./images/user-button@2xrl.webp"
import signIn from "./images/sign-in@2xrl.webp"
import verify from "./images/verify@2xrl.webp"
import userButton2 from "./images/user-button-2@2xrl.webp"
import signUp from "./images/sign-up@2xrl.webp"
import logo from "./images/logo.png"
import "./home.css"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "./components/footer"

import { CARDS } from "./consts/cards"
import { ClerkLogo } from "./components/clerk-logo"
import { NextLogo } from "./components/next-logo"

export default function Home() {
  return (
    <>
      <main className="">
        <div className="w-full bg-white max-w-[75rem] mx-auto flex flex-col border-l border-r border-[#F2F2F2] row-span-3">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[#F2F2F2]" />
          <div className="p-10 border-b border-[#F2F2F2]">
            <h1 className="text-5xl font-bold tracking-tight text-[#131316] relative">
              Nain Opticals
            </h1>

            <p className="text-[#5E5F6E] pt-3 pb-6 max-w-[30rem] text-[1.0625rem] relative">
              A Vision for Champaran
            </p>
            <div className="relative flex gap-3">
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold"
                >
                  Dashboard
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>

        </div>
        {/* <div className="absolute left-0 right-0 bottom-0 h-[18.75rem] bg-gradient-to-t from-white" /> */}
      </main>
      {/* <LearnMore cards={CARDS} /> */}
      {/* <Footer /> */}
    </>
  )
}
