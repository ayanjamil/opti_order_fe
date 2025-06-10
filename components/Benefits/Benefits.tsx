"use client";
import dynamic from "next/dynamic";

// import BenefitSection from "./BenefitSection";

interface IBenefit {
    title: string;
    description: string;
    imageSrc: string;
}
const BenefitSection = dynamic(() => import("./BenefitSection"), {
    ssr: false,
});

export const benefits: IBenefit[] = [
    {
        title: "Comprehensive Eye Exams, Your eyes deserve the best",
        description:
            "Our expert optometrists use state-of-the-art technology to assess your vision and eye health with precision. From routine check-ups to specialized screenings, we ensure that your eyes are in the best hands—so you can see every detail, every day.",
        imageSrc: "/images/benefits/01_ben.jpg",
    },
    {
        title: "Designer Eyewear Collection, Look sharp. Feel confident.",
        description:
            "Discover frames that speak your style! Explore our handpicked selection of international and Indian brands—whether you love classic elegance, modern minimalism, or bold trends, we have something to match your personality.",
        imageSrc: "/images/benefits/02_ben.jpg",
    },
    {
        title: "Custom Lenses & Solutions, Tailored vision, just for you.",
        description:
            "No two eyes are the same. That’s why we offer a wide range of lens options—single vision, progressive, anti-glare, blue-light blocking, and more. Our experts help you choose lenses that fit your lifestyle, from office work to outdoor adventures.",
        imageSrc: "/images/benefits/03_ben.jpg",
    },
    {
        title: "Contact Lens Fitting & Care, Freedom and comfort, all day long.",
        description:
            "Thinking about switching to contact lenses? Our specialists guide you through the process, ensuring a perfect fit and providing tips for easy, safe usage. Daily, monthly, or specialty lenses—we have it all.",
        imageSrc: "/images/benefits/04_ben.jpg",
    },
    {
        title: "Fast and Free Repairs & 24/7 Support, We’re here when you need us",
        description:
            "Broken frame? Lens trouble? Our quick repair services and always-available support mean you never have to go without clear vision for long.",
        imageSrc: "/images/benefits/05_ben.jpg",
    },
];

const Benefits = () => {
    return (
        <div id="features" className="my-4">
            <h2 className="sr-only">Features</h2>
            {benefits.map((item, index) => (
                <BenefitSection
                    key={index}
                    benefit={item}
                    imageAtRight={index % 2 !== 0}
                />
            ))}
        </div>
    );
};


export default Benefits;
