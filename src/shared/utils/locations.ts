export interface Location {
  key: string;
  name: string;
  image: string;
  background: string;
  x: number; // Процент от ширины
  y: number; // Процент от высоты
  requiredLevel: number;
}

export const locations: Location[] = [
  {
    key: "two-mountains",
    name: "Две горы",
    image: "/images/backgrounds/upscaled/two-mountains.webp",
    background: "/images/backgrounds/upscaled/two-mountains.webp",
    x: 35,
    y: 28,
    requiredLevel: 1,
  },
  {
    key: "ark-mountain",
    name: "Гора-арка",
    image: "/images/backgrounds/upscaled/ark-mountain.webp",
    background: "/images/backgrounds/upscaled/ark-mountain.webp",
    x: 13.5,
    y: 25,
    requiredLevel: 1,
  },
  {
    key: "desert-mountains",
    name: "Горы в пустыне",
    image: "/images/backgrounds/upscaled/desert-mountains.webp",
    background: "/images/backgrounds/upscaled/desert-mountains.webp",
    x: 80,
    y: 80,
    requiredLevel: 2,
  },
  {
    key: "desert",
    name: "Пустыня",
    image: "/images/backgrounds/upscaled/desert.webp",
    background: "/images/backgrounds/upscaled/desert.webp",
    x: 78.5,
    y: 86,
    requiredLevel: 1,
  },
  {
    key: "flying-lands",
    name: "Парящие острова",
    image: "/images/backgrounds/upscaled/flying-lands.webp",
    background: "/images/backgrounds/upscaled/flying-lands.webp",
    x: 49.75,
    y: 51.75,
    requiredLevel: 3,
  },
  {
    key: "mountain-village",
    name: "Горная деревня",
    image: "/images/backgrounds/upscaled/mountain-village.webp",
    background: "/images/backgrounds/upscaled/mountain-village.webp",
    x: 75,
    y: 65,
    requiredLevel: 1,
  },
  {
    key: "ruins-lake",
    name: "Руины подле озера",
    image: "/images/backgrounds/upscaled/ruins-lake.webp",
    background: "/images/backgrounds/upscaled/ruins-lake.webp",
    x: 55,
    y: 70,
    requiredLevel: 4,
  },
  {
    key: "sword-valley",
    name: "Обрыв меча",
    image: "/images/backgrounds/upscaled/sword-valley.webp",
    background: "/images/backgrounds/upscaled/sword-valley.webp",
    x: 29,
    y: 80,
    requiredLevel: 5,
  },
  {
    key: "under-the-tree",
    name: "Под деревом",
    image: "/images/backgrounds/upscaled/under-the-tree.webp",
    background: "/images/backgrounds/upscaled/under-the-tree.webp",
    x: 80,
    y: 50,
    requiredLevel: 6,
  },
  {
    key: "valley-capsules",
    name: "Капсулы в долине",
    image: "/images/backgrounds/upscaled/valley-capsules.webp",
    background: "/images/backgrounds/upscaled/valley-capsules.webp",
    x: 66,
    y: 73,
    requiredLevel: 7,
  },
  {
    key: "winter-mountain",
    name: "Снежная гора",
    image: "/images/backgrounds/upscaled/winter-mountain.webp",
    background: "/images/backgrounds/upscaled/winter-mountain.webp",
    x: 50,
    y: 20,
    requiredLevel: 10,
  },
];
