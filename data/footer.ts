interface IMenuItem {
    text: string;
    url: string;
}

interface ISocials {
    facebook?: string;
    github?: string;
    instagram?: string;
    linkedin?: string;
    threads?: string;
    twitter?: string;
    youtube?: string;
    x?: string;
    [key: string]: string | undefined;
}


export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
    googleMaps: string;
} = {
    subheading: "At Nain Optical, we believe seeing well enhances living well. Step into a world of clarity and style. We’re here to make your vision journey seamless and satisfying.",
    quickLinks: [
        {
            text: "Features",
            url: "/#features"
        },
        {
            text: "Results",
            url: "/#results"
        },
        {
            text: "Reach Us",
            url: "/#reachus"
        },
        {
            text: "Why Us",
            url: "/#whyus"
        }
    ],
    email: 'nainopticals.info@gmail.com',
    telephone: '9709839113',
    googleMaps: 'https://g.co/kgs/uWQ8vt1',
    socials: {
        // x: 'https://twitter.com/x',
        // twitter: 'https://twitter.com/Twitter',
        // facebook: 'https://facebook.com',
        // youtube: 'https://youtube.com',
        linkedin: 'https://www.linkedin.com/company/fnx-labsco/',
        // threads: 'https://www.threads.net',
        // instagram: 'https://www.instagram.com',
    },
    // telephone: ""
}