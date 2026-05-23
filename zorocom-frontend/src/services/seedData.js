// 7 default companies seeded into the app on first load
// Logos use Clearbit's free logo API — returns real company logos by domain

export const SEED_COMPANIES = [
  {
    name: "Google",
    location: "1600 Amphitheatre Parkway, Mountain View, CA",
    city: "Mountain View",
    foundedOn: 1998,
    logo: "https://logo.clearbit.com/google.com",
    description:
      "A global technology leader specializing in internet-related services and products, including search engines, cloud computing, and AI.",
  },
  {
    name: "Microsoft",
    location: "One Microsoft Way, Redmond, WA",
    city: "Redmond",
    foundedOn: 1975,
    logo: "https://logo.clearbit.com/microsoft.com",
    description:
      "A multinational technology corporation producing software, consumer electronics, and cloud services. Home of Windows, Azure, and Office.",
  },
  {
    name: "Apple",
    location: "One Apple Park Way, Cupertino, CA",
    city: "Cupertino",
    foundedOn: 1976,
    logo: "https://logo.clearbit.com/apple.com",
    description:
      "Designs, manufactures, and sells consumer electronics, software, and online services. Known for iPhone, Mac, and the App Store ecosystem.",
  },
  {
    name: "Amazon",
    location: "410 Terry Ave N, Seattle, WA",
    city: "Seattle",
    foundedOn: 1994,
    logo: "https://logo.clearbit.com/amazon.com",
    description:
      "The world's largest e-commerce and cloud computing company. AWS powers a significant portion of the global internet infrastructure.",
  },
  {
    name: "Meta",
    location: "1 Hacker Way, Menlo Park, CA",
    city: "Menlo Park",
    foundedOn: 2004,
    logo: "https://logo.clearbit.com/meta.com",
    description:
      "Builds technologies that connect people — Facebook, Instagram, WhatsApp, and Quest VR. Pioneering the future of the metaverse.",
  },
  {
    name: "Netflix",
    location: "100 Winchester Circle, Los Gatos, CA",
    city: "Los Gatos",
    foundedOn: 1997,
    logo: "https://logo.clearbit.com/netflix.com",
    description:
      "The world's leading streaming entertainment service with 260M+ paid members. Produces award-winning original series and films globally.",
  },
  {
    name: "Spotify",
    location: "4 World Trade Center, New York, NY",
    city: "Stockholm",
    foundedOn: 2006,
    logo: "https://logo.clearbit.com/spotify.com",
    description:
      "A digital music, podcast, and audiobook service that gives access to millions of songs and content from creators around the world.",
  },
];
