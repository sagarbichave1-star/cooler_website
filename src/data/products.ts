export type ProductTone = "ocean" | "lagoon" | "aqua" | "mist";

export type Product = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  intendedFor: string;
  tone: ProductTone;
  featured?: boolean;
  model?: string;
  tankCapacity?: string;
  coolingArea?: string;
  powerConsumption?: string;
  dimensions?: string;
  features?: string[];
  specifications?: { label: string; value: string }[];
  imageUrl?: string;
};

const tones: ProductTone[] = ["ocean", "lagoon", "aqua", "mist"];
const slugFor = (name: string) =>
  name
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Transparent, locally hosted product cutouts. Capacity variants intentionally
// keep their own catalogue records, even where the physical shell is shared.
// This avoids white image stages across the cards, hero, and product details.
const productImages: Record<string, string> = {
  apex: "/products/apex-kazer.png",
  bajrangi: "/products/bajrangi-whiff.png",
  dominator: "/products/dominator-blaze-80.png",
  "rambo-max": "/products/rambo-max-rambo-150-plus.png",
  "tent-panther-with-autoswing": "/products/tent-panther.png",
  "epic-max": "/products/epic.png",
  atlas: "/products/atlas-zephyr.png",
  iceberg: "/products/iceberg-iceland.png",
  titan: "/products/titan-proto.png",
  blaze: "/products/blaze-estina.png",
  "blaze-80": "/products/dominator-blaze-80.png",
  "rambo-jr": "/products/rambo-jr.png",
  "rambo-jr-100": "/products/rambo-jr-100.png",
  "rambo-dd": "/products/rambo-jr.png",
  proto: "/products/titan-proto.png",
  "proto-100": "/products/titan-proto.png",
  epic: "/products/epic.png",
  "epic-100l": "/products/epic.png",
  "rambo-100": "/products/rambo-100.png",
  "rambo-125": "/products/rambo-jr.png",
  "rambo-150": "/products/rambo-jr-100.png",
  "rambo-100-plus": "/products/rambo-100.png",
  "rambo-125-plus": "/products/rambo-125-plus.png",
  "rambo-150-plus": "/products/rambo-max-rambo-150-plus.png",
  "gloster-100": "/products/gloster-100.png",
  "gloster-125": "/products/gloster-125.png",
  "gloster-150": "/products/gloster-150.png",
  "tent-panther": "/products/tent-panther.png",
  "tent-marvel": "/products/tent-panther.png",
  mist: "/products/mist.png",
  zephyr: "/products/atlas-zephyr.png",
  whiff: "/products/bajrangi-whiff.png",
  kazer: "/products/apex-kazer.png",
  supremo: "/products/supremo.png",
  iceland: "/products/iceberg-iceland.png",
  aeon: "/products/aeon.png",
  estina: "/products/blaze-estina.png",
};

// Verified against the matching current Novamax product records on 6 September
// 2026. Models omitted here were not matched to a current published coverage
// figure, so the website deliberately does not infer an area from tank size or
// air-flow alone.
const verifiedCoolingAreas: Record<string, string> = {
  mist: "500 sq ft",
  kazer: "500 sq ft",
  whiff: "600 sq ft",
  zephyr: "600 sq ft",
  iceland: "550 sq ft",
  aeon: "500 sq ft",
  supremo: "550 sq ft",
  blaze: "500 sq ft",
  "blaze-80": "500 sq ft",
  epic: "500 sq ft",
  "rambo-100": "1200 sq ft",
  "rambo-125": "1200 sq ft",
  "rambo-150": "1200 sq ft",
  "rambo-100-plus": "1200 sq ft",
  "rambo-125-plus": "1200 sq ft",
  "rambo-150-plus": "1200 sq ft",
  "gloster-100": "1500 sq ft",
  "gloster-125": "1500 sq ft",
  "gloster-150": "1500 sq ft",
  proto: "1000 sq ft",
};

const apexFeatures = [
  "Powerful air delivery",
  "Mosquito free",
  "Air throw up to 30 ft",
  "3 speed controls",
  "Power packed sturdy fan motor",
  "Large cooling pads",
  "4-way motorised vertical louvers",
  "Inverter compatible",
];
const dominatorFeatures = [
  "Powerful air delivery",
  "Auto water refill system",
  "High gloss durable body",
  "3 speed controls",
  "Power packed sturdy fan motor",
  "Large cooling pads",
  "Auto filling of tank",
  "Inverter compatible",
];

const launchModels: [string, string | undefined, string[]][] = [
  ["Apex", "Indoor, Outdoor, Café, Office", apexFeatures],
  ["Bajrangi", "Indoor, Outdoor, Café, Office", apexFeatures],
  ["Dominator", "Indoor, Outdoor, Café, Office", dominatorFeatures],
  ["Rambo Max", "Indoor, Outdoor, Café, Office", dominatorFeatures],
  [
    "Tent Panther with Autoswing",
    "Indoor, Outdoor, Café, Office",
    dominatorFeatures,
  ],
  ["Epic Max", "Indoor, Outdoor, Café, Office", dominatorFeatures],
  ["Atlas", undefined, dominatorFeatures],
  ["Iceberg", undefined, dominatorFeatures],
];

type TechnicalRow = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string?,
];
const commercialModels: TechnicalRow[] = [
  [
    "Titan",
    "3100 m³/H",
    '9"',
    "15 L",
    "150 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "310×470×590",
  ],
  [
    "Blaze",
    "4500 m³/H",
    '12"',
    "40 L",
    "180 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "535×410×1000",
  ],
  [
    "Blaze 80",
    "4500 m³/H",
    '12"',
    "80 L",
    "180 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "535×410×1155",
  ],
  [
    "Rambo Jr.",
    "5800 m³/H",
    '18"',
    "75 L",
    "250 W",
    "Auto Swing",
    "Not applicable",
    "Yes",
    "Yes",
    "760×540×1280",
  ],
  [
    "Rambo Jr. 100",
    "5800 m³/H",
    '18"',
    "100 L",
    "250 W",
    "Auto Swing",
    "Not applicable",
    "Yes",
    "Yes",
    "760×540×1380",
  ],
  [
    "Rambo DD",
    "5800 m³/H",
    '18"',
    "75 L",
    "450 W",
    "Auto Swing",
    "Not applicable",
    "Yes",
    "Yes",
    "760×560×2080",
  ],
  [
    "Proto",
    "5800 m³/H",
    '18"',
    "75 L",
    "250 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "785×500×1360",
  ],
  [
    "Proto 100",
    "5800 m³/H",
    '18"',
    "100 L",
    "250 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "785×500×1460",
  ],
  [
    "Epic",
    "4750 m³/H",
    '17"',
    "75 L",
    "250 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "700×570×1240",
  ],
  [
    "Epic (100L)",
    "4750 m³/H",
    '17"',
    "100 L",
    "250 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "700×570×1360",
  ],
  [
    "Rambo 100",
    "7600 m³/H",
    '20"',
    "100 L",
    "450 W",
    "Not specified",
    "Not specified",
    "Yes",
    "Yes",
    "865×620×1340",
  ],
  [
    "Rambo 125",
    "7600 m³/H",
    '20"',
    "125 L",
    "450 W",
    "Not specified",
    "Not specified",
    "Yes",
    "Yes",
    "865×620×1440",
  ],
  [
    "Rambo 150",
    "7600 m³/H",
    '20"',
    "150 L",
    "450 W",
    "Not specified",
    "Not specified",
    "Yes",
    "Yes",
    "865×620×1500",
  ],
  [
    "Rambo 100+",
    "7600 m³/H",
    '20"',
    "100 L",
    "450 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "865×650×1340",
  ],
  [
    "Rambo 125+",
    "7600 m³/H",
    '20"',
    "125 L",
    "450 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "865×650×1440",
  ],
  [
    "Rambo 150+",
    "7600 m³/H",
    '20"',
    "150 L",
    "450 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "865×650×1500",
  ],
  [
    "Gloster 100",
    "8000 m³/H",
    '22"',
    "100 L",
    "450 W",
    "Not specified",
    "Not specified",
    "Yes",
    "Yes",
    "865×570×1340",
  ],
  [
    "Gloster 125",
    "8000 m³/H",
    '22"',
    "125 L",
    "450 W",
    "Not specified",
    "Not specified",
    "Yes",
    "Yes",
    "865×570×1440",
  ],
  [
    "Gloster 150",
    "8000 m³/H",
    '22"',
    "150 L",
    "450 W",
    "Not specified",
    "Not specified",
    "Yes",
    "Yes",
    "865×570×1500",
  ],
  [
    "Tent Panther",
    "11,300 m³/H",
    '26"',
    "150 L",
    "750 W",
    "Auto Swing",
    "Not applicable",
    "Yes",
    "Yes",
    "1070×560×1530",
  ],
  [
    "Tent Marvel",
    "14,500 m³/H",
    '32"',
    "180 L",
    "800 W",
    "Not specified",
    "Not specified",
    "Yes",
    "Yes",
    "1120×660×1760",
  ],
];
const homeModels: TechnicalRow[] = [
  [
    "Mist",
    "4500 m³/H",
    '16"',
    "75 L",
    "180 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "640×465×1230",
    "Not specified",
  ],
  [
    "Zephyr",
    "4500 m³/H",
    '16"',
    "90 L",
    "180 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "630×465×1250",
    "Not specified",
  ],
  [
    "Whiff",
    "4800 m³/H",
    '18"',
    "100 L",
    "250 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "685×550×1265",
    "Not specified",
  ],
  [
    "Kazer",
    "4500 m³/H",
    '16"',
    "80 L",
    "180 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "640×465×1220",
    "Yes",
  ],
  [
    "Supremo",
    "4500 m³/H",
    '16"',
    "85 L",
    "180 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "620×465×1260",
    "Yes",
  ],
  [
    "Iceland",
    "4500 m³/H",
    '16"',
    "90 L",
    "180 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "690×455×1240",
    "Yes",
  ],
  [
    "Aeon",
    "4500 m³/H",
    '16"',
    "85 L",
    "180 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "620×465×1230",
    "Yes",
  ],
  [
    "Estina",
    "2660 m³/H",
    "Blower type",
    "40 L",
    "240 W",
    "Auto Swing",
    "Manual",
    "Yes",
    "Yes",
    "630×530×590",
    "Not specified",
  ],
];

function technicalProduct(
  row: TechnicalRow,
  category: string,
  intendedFor: string,
  index: number,
): Product {
  const [
    name,
    airFlow,
    fanSize,
    tankCapacity,
    powerConsumption,
    vertical,
    horizontal,
    gardenHose,
    castorWheels,
    dimensions,
    iceChamber,
  ] = row;
  const specifications = [
    ["Air flow", airFlow],
    ["Fan size", fanSize],
    ["Vertical louvers", vertical],
    ["Horizontal louvers", horizontal],
    ["Garden hose", gardenHose],
    ["Castor wheels", castorWheels],
    ...(iceChamber ? [["Ice chamber", iceChamber]] : []),
  ].map(([label, value]) => ({ label, value }));
  return {
    slug: slugFor(name),
    name,
    model: name,
    category,
    summary: `${airFlow} air flow with a ${fanSize} fan and ${tankCapacity} tank capacity.`,
    intendedFor,
    tankCapacity,
    powerConsumption,
    dimensions: `${dimensions} mm`,
    coolingArea: verifiedCoolingAreas[slugFor(name)],
    specifications,
    tone: tones[index % tones.length],
    featured: index < 4,
    imageUrl: productImages[slugFor(name)],
  };
}

export const products: Product[] = [
  ...launchModels.map(
    ([name, intendedFor, features], index) =>
      ({
        slug: slugFor(name),
        name,
        model: name,
        category: "New Launch",
        summary: features.join(", ") + ".",
        intendedFor:
          intendedFor || "Usage guidance not specified in the catalogue",
        features: [...features],
        tone: tones[index % tones.length],
        featured: index < 4,
        coolingArea: verifiedCoolingAreas[slugFor(name)],
        imageUrl: productImages[slugFor(name)],
      }) satisfies Product,
  ),
  ...commercialModels.map((row, index) =>
    technicalProduct(
      row,
      "Commercial / Desert",
      "Commercial and larger spaces",
      index,
    ),
  ),
  ...homeModels.map((row, index) =>
    technicalProduct(
      row,
      "Personal / Home",
      "Homes and personal spaces",
      index,
    ),
  ),
];

export function filterProducts(
  query: string,
  category = "All",
  catalogue = products,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return catalogue.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const searchableText = [
      product.name,
      product.category,
      product.summary,
      product.intendedFor,
      product.model,
      ...(product.features || []),
      ...(product.specifications || []).flatMap(({ label, value }) => [
        label,
        value,
      ]),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();

    return (
      matchesCategory &&
      (!normalizedQuery || searchableText.includes(normalizedQuery))
    );
  });
}
