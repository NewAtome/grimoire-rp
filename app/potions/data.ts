export type Potion = {
  slug: string;
  nom: string;
  icone: string;
  resume: string;
  ingredients: string[];
  preparation: string[];
  observations?: string;
};

export const potions: Potion[] = [
  {
    slug: "potion-de-soin",
    nom: "Potion de soin",
    icone: "❤️",
    resume: "Une potion simple utilisée pour restaurer l'énergie.",
    ingredients: [
      "3 feuilles de mandragore",
      "1 fiole d'eau de lune",
      "2 pétales de lys rouge",
    ],
    preparation: [
      "Faire chauffer doucement l'eau de lune.",
      "Ajouter les feuilles de mandragore.",
      "Mélanger trois fois dans le sens horaire.",
      "Ajouter les pétales de lys rouge.",
      "Laisser reposer cinq minutes.",
    ],
    observations:
      "La potion doit prendre une couleur rouge claire. Une couleur trop sombre indique une température trop élevée.",
  },
  {
    slug: "potion-de-sommeil",
    nom: "Potion de sommeil",
    icone: "🌙",
    resume: "Une préparation provoquant un sommeil profond et temporaire.",
    ingredients: [
      "Lavande séchée",
      "Racine de valériane",
      "Eau pure",
    ],
    preparation: [
      "Porter l'eau à faible ébullition.",
      "Ajouter la lavande.",
      "Incorporer la racine de valériane.",
      "Mélanger lentement pendant deux minutes.",
    ],
    observations:
      "La préparation doit dégager une légère fumée violette.",
  },
];
