"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MapEmbed: React.FC = () => {
    return (
        <motion.div
            id="reachus"
            className="w-full px-4 py-12 sm:px-6 md:px-16 bg-white"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
        >
            <Card className="shadow-2xl rounded-2xl overflow-hidden border-0 max-w-6xl mx-auto">
                <CardContent className="p-0 flex flex-col md:flex-row">
                    {/* Left Content */}
                    <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-snug">
                            Ready for <span className="text-blue-800">clear vision</span> forever?
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6">
                            Come visit us at Nain Optical—your go-to destination for expert eye care, stylish eyewear, and personalized attention.
                        </p>
                        <a
                            href="https://www.google.com/maps/place/Nain+Optical+%7C%7C+Best+Optical+Shop+In+Bettiah+%7C+Best+Opticain+In+Bettiah/@26.7994255,84.498158,17z/data=!3m1!4b1!4m6!3m5!1s0x39936e978a89c807:0x5f0e2da1cad86832!8m2!3d26.7994255!4d84.5007383!16s%2Fg%2F11c205x1q7?entry=ttu"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="default">Get Directions</Button>
                        </a>
                    </div>

                    {/* Map Section */}
                    <div className="w-full md:w-1/2 h-[300px] sm:h-[350px] md:h-[400px]">
                        <iframe
                            className="w-full h-full"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d905.5746145122175!2d84.5007383!3d26.7994255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39936e978a89c807%3A0x5f0e2da1cad86832!2sNain%20Optical%20%7C%7C%20Best%20Optical%20Shop%20In%20Bettiah%20%7C%20Best%20Opticain%20In%20Bettiah!5e0!3m2!1sen!2sin!4v1717936549335!5m2!1sen!2sin"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            style={{ border: 0 }}
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default MapEmbed;
