"use client"
import React from "react";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

const steps = [
    {
        step: "Step 1",
        title: "Personalized Consultations",
        description:
            "We listen to your needs and recommend solutions that fit your lifestyle and budget.",
    },
    {
        step: "Step 2",
        title: "Efficient Service",
        description:
            "Fast, accurate, and hassle-free—so you spend less time waiting and more time enjoying clear vision.",
    },
    {
        step: "Step 3",
        title: "Quality & Trust",
        description:
            "We offer only the best products and stand by our service, ensuring your satisfaction every step of the way.",
    },
    {
        step: "Step 4",
        title: "Affordable Options",
        description:
            "From budget-friendly frames to premium brands, we make quality eyewear accessible to everyone.",
    },

];

export default function WhyUs() {
    return (
        <section id="whyus" className="py-20 px-4">
            <div className="max-w-6xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Clients Prefer Nain Optical</h2>
                <p className="text-lg text-gray-600">
                    Nain Optical is your reliable partner for all things vision. Want to see better and look great, with less hassle? Here’s how we deliver:
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                    >

                        <Card
                            key={index}
                            className="bg-accent border border-gray-200 shadow-md hover:shadow-xl hover:bg-white transition-colors duration-300 w-full h-full min-h-[240px]"
                        >
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-sm">{step.description}</p>
                            </CardContent>
                        </Card>

                    </motion.div>

                ))}
            </div>
        </section>
    );
}
