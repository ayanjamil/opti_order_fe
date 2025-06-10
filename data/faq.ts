// import { IFAQ } from "@/types";
export interface IFAQ {
    question: string;
    answer: string;
}

export const faqs: IFAQ[] = [
    {
        question: `How do I get my prescription for Nain Opticals?`,
        answer:
            "Simply visit our store for a comprehensive eye exam, or bring a valid prescription from your eye doctor. We recommend updating your prescription every one to two years for the best results.[2][6]",
    },
    {
        question: "Can I use my contact lens prescription to buy glasses?",
        answer:
            "No, contact lens and eyeglass prescriptions are different. Please provide a valid eyeglass prescription for your order.[2][6]",
    },
    {
        question: "Can I order glasses without prescription lenses?",
        answer:
            "Yes! You can order frames with non-prescription (plano) lenses if you just want them for fashion or blue-light protection.[6]",
    },
    {
        question: "What brands and styles do you offer?",
        answer:
            "We offer a wide range of authentic brands and styles, from classic to trendy. All our eyewear comes with original cases and certificates of authenticity.[5]",
    },
    {
        question: "How long does it take to receive my glasses?",
        answer:
            "Most orders are ready within 3–7 days, depending on your prescription and lens choices. We’ll notify you as soon as your eyewear is ready for pickup or delivery.[5]",
    },
    {
        question: "What if I enter my prescription incorrectly?",
        answer:
            "Contact us immediately! We process orders quickly, so let us know as soon as possible to correct any mistakes.[2][6]",
    },
    {
        question: "Can I send my own frames to be fitted with new lenses?",
        answer:
            "Currently, we only fit lenses into frames purchased from our store to ensure the best fit and warranty coverage.[5]",
    },
    {
        question: "Do you offer progressive or multifocal lenses?",
        answer:
            "Yes, we provide progressive, bifocal, and single vision lenses, including options for astigmatism and blue-light protection.[5]",
    },
    {
        question: "What is your return or exchange policy?",
        answer:
            "If you’re not satisfied with your purchase, contact us within 7 days for adjustments or exchanges. Please see our full policy in-store or on our website.",
    },
    {
        question: "How do I care for my new glasses?",
        answer:
            "Always use the provided case and cleaning cloth. Avoid using harsh chemicals and keep your glasses away from extreme heat to maintain lens quality.",
    },
];
