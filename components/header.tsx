'use client';

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"

import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';

// import Container from './Container';
interface Props {
    className?: string;
}

const Container: React.FC<React.PropsWithChildren<Props>> = ({ children, className }: React.PropsWithChildren<Props>) => {
    return (
        <div className={`px-5 w-full max-w-7xl mx-auto ${className ? className : ""}`}>{children}</div>
    )
}
// import { siteDetails } from '@/data/siteDetails';
// import { menuItems } from '@/data/menuItems';
import Image from 'next/image';

// import { IMenuItem } from "@/types";
interface IMenuItem {
    text: string;
    url: string;
}

const menuItems: IMenuItem[] = [
    {
        text: "Features",
        url: "/#features"
    },
    {
        text: "Why Us",
        url: "/#whyus"
    },
    {
        text: "Reach Us",
        url: "/#reachus"
    },
];


const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/30 backdrop-blur-md">
            <Container className="!px-0">
                <nav className="flex justify-between items-center py-2 px-5 md:py-2">
                    {/* Logo */}
                    {/* import Image from 'next/image'; */}

                    <Link href="/" className="flex items-center gap-2">
                        {/* <Image
                            src='/images/logo_bg.png'
                            alt=""
                            layout=""
                            objectFit=""
                            quality={80}
                            priority
                            width={156} // Specify width
                            height={156} // Specify height
                        /> */}
                        <span className="text-white font-bold text-xl">Nain Opticals</span>
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex space-x-6 items-center">
                        {menuItems.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="text-gray-200 hover:text-white transition-colors ">
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                        <li>
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
                            {/* <Link
                                href="/#cta"
                                className=" bg-zinc-100 hover:bg-primary-accent px-6 py-2 rounded-full transition-colors"
                            >
                                Book a Demo
                            </Link> */}
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="bg-primary text-white focus:outline-none rounded-full w-10 h-10 flex items-center justify-center"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <HiOutlineXMark className="h-6 w-6" />
                            ) : (
                                <HiBars3 className="h-6 w-6" />
                            )}
                            <span className="sr-only">Toggle navigation</span>
                        </button>
                    </div>
                </nav>
            </Container>

            {/* Mobile Menu with Transition */}
            <Transition
                show={isOpen}
                enter="transition ease-out duration-200 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div id="mobile-menu" className="md:hidden bg-black/90 text-white shadow-lg">
                    <ul className="flex flex-col space-y-4 pt-4 pb-6 px-6">
                        {menuItems.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="hover:text-yellow-400" onClick={toggleMenu}>
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                        <li>
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
                            {/* <Link
                                href="/#cta"
                                className=" bg-zinc-100 hover:bg-primary-accent px-6 py-2 rounded-full transition-colors"
                            >
                                Book a Demo
                            </Link> */}
                        </li>
                    </ul>
                </div>
            </Transition>
        </header >
    );
};

export default Header;
