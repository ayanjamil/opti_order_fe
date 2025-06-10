"use client";
import React from "react";
import Image from "next/image";
// import { heroDetails } from "@/data/hero";
export const heroDetails = {
    heading: 'See the World, See the Difference',
    subheading: 'Welcome to your vision destination! \n At Nain Optical, we blend clarity with style.',
    centerImageSrc: '/app/images/bg.jpg',
}
import { motion } from "framer-motion";

const Hero: React.FC = () => {
    return (
        <section
            id="hero"
            className="relative flex items-center justify-center px-5 h-screen overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0 -z-20">
                <Image
                    src='/images/bg.jpg'
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    quality={80}
                    priority
                />
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 -z-10" />

            {/* Optional Grid Effect */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />

            {/* Animated Content */}
            <div className="  translate-y-20 md:translate-y-44">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center text-white px-4 translate-y-20 md:translate-y-44"
                >
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        {heroDetails.heading}
                    </motion.h1>

                    <motion.p
                        className="mt-4 text-lg md:text-xl max-w-lg mx-auto text-white/90"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        {heroDetails.subheading}
                    </motion.p>
                </motion.div>

            </div>


        </section>
    );
};

export default Hero;
