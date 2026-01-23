export interface Product {
  id: string;
  name: string;
  subName: string;
  price: string;
  description: string;
  folderPath: string;
  themeColor: string;
  gradient: string;
  features: string[];
  stats: { label: string; val: string }[];
  section1: { title: string; subtitle: string };
  section2: { title: string; subtitle: string };
  section3: { title: string; subtitle: string };
  section4: { title: string; subtitle: string };
  detailsSection: { title: string; description: string; imageAlt: string };
  freshnessSection: { title: string; description: string };
  buyNowSection: {
    price: string;
    unit: string;
    processingParams: string[];
    deliveryPromise: string;
    returnPolicy: string;
  };
}

export const products: Product[] = [
  {
    id: "mango",
    name: "Classic Boba Tea",
    subName: "Authentic. Fresh. Delicious.",
    price: "₹120",
    description: "Premium Tea - Fresh Tapioca Pearls - Handcrafted Daily",
    folderPath: "/src/assets/Headerimg",
    themeColor: "#FFB74D",
    gradient: "linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)",
    features: ["Premium Tea Leaves", "Fresh Tapioca Pearls", "Handcrafted Daily"],
    stats: [{ label: "Tea Quality", val: "Premium" }, { label: "Freshness", val: "Daily" }, { label: "Pearls", val: "100%" }],
    section1: { title: "Totea Bubble Tea & More.", subtitle: "Where tradition meets innovation." },
    section2: { title: "Premium tea, perfectly brewed.", subtitle: "Sourced from the finest tea gardens and steeped to perfection for that authentic boba experience." },
    section3: { title: "Fresh tapioca pearls, every day.", subtitle: "Made fresh daily with premium ingredients. Each chewy pearl delivers the perfect texture and sweetness." },
    section4: { title: "Crafted with passion, served with love.", subtitle: "Experience the authentic taste of Taiwan's most beloved beverage." },
    detailsSection: {
      title: "The Art of Boba",
      description: "Our Classic Boba Tea is crafted using premium tea leaves sourced from renowned tea gardens. Each cup is brewed fresh to order, ensuring optimal flavor extraction. We use only the finest tapioca pearls, cooked to perfection for that signature chewy texture. Every sip delivers the perfect balance of creamy milk tea and sweet, satisfying pearls.",
      imageAlt: "Boba Tea Details"
    },
    freshnessSection: {
      title: "Freshness Guaranteed",
      description: "At Totea, freshness is non-negotiable. Our tapioca pearls are prepared fresh daily, never stored overnight. Our tea is brewed in small batches throughout the day to maintain peak flavor. We use only premium ingredients and never compromise on quality. Every cup is made with care, ensuring you experience the authentic taste of premium boba tea."
    },
    buyNowSection: {
      price: "₹120",
      unit: "per regular size",
      processingParams: ["Freshly Brewed", "Daily Made Pearls", "Premium Ingredients"],
      deliveryPromise: "Available for pickup or delivery. Freshly prepared when you order. Customizable sweetness and ice levels.",
      returnPolicy: "100% Satisfaction Guarantee. Love it or we'll make it right—your happiness is our priority."
    }
  },
  {
    id: "chocolate",
    name: "Dutch Chocolate",
    subName: "Velvety smooth.",
    price: "₹140",
    description: "Premium Cocoa - Almond Milk base - Plant Protein",
    folderPath: "/src/assets/Headerimg",
    themeColor: "#8D6E63",
    gradient: "linear-gradient(135deg, #8D6E63 0%, #5D4037 100%)",
    features: ["Premium Cocoa", "Almond Milk", "Plant Protein"],
    stats: [{ label: "Dairy", val: "0%" }, { label: "Protein", val: "12g" }, { label: "Cocoa", val: "100%" }],
    section1: { title: "Dutch Chocolate.", subtitle: "Velvety smooth." },
    section2: { title: "Decadence redefined.", subtitle: "Rich, dark cocoa blended with creamy almond milk for a guilt-free treat." },
    section3: { title: "Plant-powered energy.", subtitle: "Loaded with natural plant protein to fuel your active lifestyle." },
    section4: { title: "Indulgence without compromise.", subtitle: "" },
    detailsSection: {
      title: "Ethically Sourced Cocoa",
      description: "We source our cocoa from sustainable farms in Ghana, ensuring fair wages and premium quality. Blended with our house-made almond milk, this drink offers a silky texture that rivals traditional dairy shakes, but with zero cholesterol and 100% plant-based goodness.",
      imageAlt: "Chocolate Details"
    },
    freshnessSection: {
      title: "Cold-Crafted Perfection",
      description: "Heat destroys delicate cocoa flavonoids. That's why we mix our Dutch Chocolate cold. Our almond milk is pressed fresh daily, never stored. The result is a clean, robust chocolate flavor that feels heavy on the tongue but light on the stomach."
    },
    buyNowSection: {
      price: "₹140",
      unit: "per 300ml bottle",
      processingParams: ["Plant Based", "Cold Blended", "Dairy Free"],
      deliveryPromise: "Shipped in insulated eco-friendly coolers. Keeps perfectly cold for 48 hours.",
      returnPolicy: "Taste the difference or get your money back."
    }
  },
  {
    id: "pomegranate",
    name: "Ruby Pomegranate",
    subName: "Antioxidant powerhouse.",
    price: "₹150",
    description: "Heart Healthy - Cold Pressed - Immunity Booster",
    folderPath: "/src/assets/Headerimg",
    themeColor: "#E57373",
    gradient: "linear-gradient(135deg, #E57373 0%, #C62828 100%)",
    features: ["Heart Healthy", "Cold Pressed", "Immunity Booster"],
    stats: [{ label: "Additives", val: "0%" }, { label: "Vitamins", val: "A,C,K" }, { label: "Purity", val: "100%" }],
    section1: { title: "Ruby Pomegranate.", subtitle: "Nature's jewel." },
    section2: { title: "Explosion of flavor.", subtitle: "Freshly pressed pomegranate arils delivering a tart and sweet sensation." },
    section3: { title: "Heart healthy goodness.", subtitle: "Packed with powerful antioxidants to protect and rejuvenate." },
    section4: { title: "Pure juice, pure life.", subtitle: "" },
    detailsSection: {
      title: "The Ruby Elixir",
      description: "Each bottle contains the juice of over 1 kg of premium pomegranates. We use a gentle pressing method to extract the juice from the arils without crushing the bitter pith. This results in a sweet, complex flavor profile that is unmatched by commercial concentrates.",
      imageAlt: "Pomegranate Details"
    },
    freshnessSection: {
      title: "Potent Preservation",
      description: "Pomegranate juice is highly sensitive to light and air. Our bottling line is designed to shield the juice from oxidation at every step. We bottle immediately after pressing to lock in the vibrant color and the potent punicalagins—unique antioxidants found only in pomegranate."
    },
    buyNowSection: {
      price: "₹150",
      unit: "per 300ml bottle",
      processingParams: ["Cold Pressed", "Oxidation Shield", "No Additives"],
      deliveryPromise: "Direct from the pressery to your doorstep. Guaranteed fresh upon arrival.",
      returnPolicy: "Damaged in transit? Instant replacement available."
    }
  }
];
