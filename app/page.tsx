"use client";

import { useMemo, useState } from "react";

type Matiere = {
  id: number;
  nom: string;
  icone: string;
  points: number;
  maximum: number;
};

type PageActive = "jetons" | "cours" | "potions" | "notes";

const annee1: Matiere[] = [
  {
    id: 1,
    nom: "Alchimie - Botanique",
    icone: "🌿",
    points: 0,
    maximum: 30,
  },
  {
    id: 2,
    nom: "Sorts",
    icone: "✨",
    points: 0,
    maximum: 40,
  },
  {
    id: 3,
    nom: "Potions",
    icone: "🧪",
    points: 0,
    maximum: 20,
  },
  {
    id: 4,
    nom: "Histoire de la magie",
    icone: "📜",
    points: 0,
    maximum: 20,
  },
  {
    id: 5,
    nom: "Créatures magiques",
    icone: "🐉",
    points: 0,
    maximum: 20,
  },
  {
    id: 6,
    nom: "Club",
    icone: "🏆",
    points: 0,
    maximum: 10,
  },
  {
    id: 7,
    nom: "Divers",
    icone: "⚡",
    points: 0,
    maximum: 40,
  },
];

const annee2: Matiere[] = [
  {
    id: 101,
    nom: "Alchimie - Botanique",
    icone: "🌿",
    points: 0,
    maximum: 20,
  },
  {
    id: 102,
    nom: "Sorts",
    icone: "✨",
    points: 0,
    maximum: 40,
  },
  {
    id: 103,
    nom: "Potions",
    icone: "🧪",
    points: 0,
    maximum: 15,
  },
  {
    id: 104,
    nom: "Histoire de la magie",
    icone: "📜",
    points: 0,
    maximum: 30,
  },
  {
    id: 105,
    nom: "Créatures magiques",
    icone: "🐉",
    points: 0,
    maximum: 25,
  },
  {
    id: 106,
    nom: "Club",
    icone: "🏆",
    points: 0,
    maximum: 20,
  },
  {
    id: 107,
    nom: "Divers",
    icone: "⚡",
    points: 0,
    maximum: 50 ,
  },
];

export default function Home() {
  const [pageActive, setPageActive] = useState<PageActive>("jetons");
  const [anneeActive, setAnneeActive] = useState<1 | 2>(1);

 const [matieresAnnee1, setMatieresAnnee1] =
  useState<Matiere[]>(annee1);

 const [matieresAnnee2, setMatieresAnnee2] =
  useState<Matiere[]>(annee2);

  const [notes, setNotes] = useState(
    "Écris ici tes notes de cours..."
  );

  const matieres =
    anneeActive === 1 ? matieresAnnee1 : matieresAnnee2;

  const totalPoints = useMemo(() => {
    return matieres.reduce(
      (total, matiere) => total + matiere.points,
      0
    );
  }, [matieres]);

  const totalMaximum = useMemo(() => {
    return matieres.reduce(
      (total, matiere) => total + matiere.maximum,
      0
    );
  }, [matieres]);

  const coursTermines = matieres.filter(
    (matiere) => matiere.points >= matiere.maximum
  ).length;

  const progression =
    totalMaximum === 0
      ? 0
      : Math.round((totalPoints / totalMaximum) * 100);

  function changerPoints(id: number, changement: number) {
    const modifier = (liste: Matiere[]) =>
      liste.map((matiere) => {
        if (matiere.id !== id) {
          return matiere;
        }

        return {
          ...matiere,
          points: Math.min(
            matiere.maximum,
            Math.max(0, matiere.points + changement)
          ),
        };
      });

    if (anneeActive === 1) {
      setMatieresAnnee1((liste) => modifier(liste));
    } else {
      setMatieresAnnee2((liste) => modifier(liste));
    }
  }

  function reinitialiser() {
    const confirmation = window.confirm(
      "Voulez-vous vraiment réinitialiser cette année ?"
    );

    if (!confirmation) {
      return;
    }

    if (anneeActive === 1) {
      setMatieresAnnee1(annee1);
    } else {
      setMatieresAnnee2(annee2);
    }
  }

  return (
    <div className="min-h-screen bg-[#090b12] text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-60 border-r border-[#292b35] bg-[#12141d] md:block">
        <div className="border-b border-[#292b35] p-5">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📚</div>

            <div>
              <h1 className="text-xl text-[#d6a928]">
                GRIMOIRE
              </h1>

              <p className="text-xs text-gray-500">
                Académie magique
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
            Navigation
          </p>

          <div className="space-y-2">
            <Menu
              actif={pageActive === "jetons"}
              icone="🪙"
              texte="Jetons"
              action={() => setPageActive("jetons")}
            />

            <Menu
              actif={pageActive === "cours"}
              icone="📖"
              texte="Cours"
              action={() => setPageActive("cours")}
            />

            <Menu
              actif={pageActive === "potions"}
              icone="🧪"
              texte="Potions"
              action={() => setPageActive("potions")}
            />

            <Menu
              actif={pageActive === "notes"}
              icone="🪶"
              texte="Mes notes"
              action={() => setPageActive("notes")}
            />
          </div>
        </nav>
      </aside>

      <main className="p-6 md:ml-60 md:p-8">
        {pageActive === "jetons" && (
          <PageJetons
            anneeActive={anneeActive}
            setAnneeActive={setAnneeActive}
            matieres={matieres}
            totalPoints={totalPoints}
            totalMaximum={totalMaximum}
            coursTermines={coursTermines}
            progression={progression}
            changerPoints={changerPoints}
            reinitialiser={reinitialiser}
          />
        )}

        {pageActive === "cours" && (
          <PageCours matieres={matieres} anneeActive={anneeActive} />
        )}

        {pageActive === "potions" && <PagePotions />}

        {pageActive === "notes" && (
          <PageNotes notes={notes} setNotes={setNotes} />
        )}
      </main>
    </div>
  );
}

function PageJetons({
  anneeActive,
  setAnneeActive,
  matieres,
  totalPoints,
  totalMaximum,
  coursTermines,
  progression,
  changerPoints,
  reinitialiser,
}: {
  anneeActive: 1 | 2;
  setAnneeActive: (annee: 1 | 2) => void;
  matieres: Matiere[];
  totalPoints: number;
  totalMaximum: number;
  coursTermines: number;
  progression: number;
  changerPoints: (id: number, changement: number) => void;
  reinitialiser: () => void;
}) {
  return (
    <>
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl text-[#d6a928]">
            SUIVI DES JETONS
          </h2>

          <p className="mt-1 text-gray-500">
            Gérez votre progression académique
          </p>
        </div>

        <button
          onClick={reinitialiser}
          className="rounded-md border border-red-900 px-4 py-2 text-sm text-red-400 hover:bg-red-950/40"
        >
          ↻ Réinitialiser
        </button>
      </header>

      <div className="mb-8 flex justify-center">
        <div className="flex rounded-lg bg-[#191b25] p-1">
          <button
            onClick={() => setAnneeActive(1)}
            className={`rounded-md px-6 py-3 ${
              anneeActive === 1
                ? "bg-[#242631] text-[#e8b928]"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            PREMIÈRE ANNÉE
          </button>

          <button
            onClick={() => setAnneeActive(2)}
            className={`rounded-md px-6 py-3 ${
              anneeActive === 2
                ? "bg-[#242631] text-[#e8b928]"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            DEUXIÈME ANNÉE
          </button>
        </div>
      </div>

      <section className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Statistique
          icone="◎"
          valeur={`${totalPoints}/${totalMaximum}`}
          texte="Points totaux"
        />

        <Statistique
          icone="🏆"
          valeur={`${coursTermines}/${matieres.length}`}
          texte="Cours complétés"
        />

        <Statistique
          icone="📖"
          valeur={String(matieres.length)}
          texte="Total cours"
        />

        <Statistique
          icone="⚠"
          valeur="0"
          texte="Haute priorité"
        />
      </section>

      <section className="mb-7">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h3 className="text-2xl text-[#d6a928]">
              {anneeActive === 1
                ? "PREMIÈRE ANNÉE"
                : "DEUXIÈME ANNÉE"}
            </h3>

            <p className="text-gray-500">
              {coursTermines}/{matieres.length} cours complétés
            </p>
          </div>

          <div className="text-right">
            <p className="text-xl text-[#d6a928]">
              {totalPoints}
              <span className="text-gray-500">
                {" "}
                / {totalMaximum}
              </span>
            </p>

            <p className="text-xs text-gray-500">
              points totaux
            </p>
          </div>
        </div>

        <Barre progression={progression} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {matieres.map((matiere) => (
          <CarteMatiere
            key={matiere.id}
            matiere={matiere}
            changerPoints={changerPoints}
          />
        ))}
      </section>
    </>
  );
}

function PageCours({
  matieres,
  anneeActive,
}: {
  matieres: Matiere[];
  anneeActive: 1 | 2;
}) {
  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl text-[#d6a928]">
          MES COURS
        </h2>

        <p className="mt-1 text-gray-500">
          Cours de {anneeActive === 1 ? "première" : "deuxième"} année
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matieres.map((matiere) => (
          <article
            key={matiere.id}
            className="rounded-lg border border-[#54421f] bg-[#171923] p-6"
          >
            <div className="text-4xl">{matiere.icone}</div>

            <h3 className="mt-4 text-xl text-[#e8b928]">
              {matiere.nom}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Consultez les chapitres, les devoirs et les documents.
            </p>

            <button className="mt-5 rounded border border-[#5e4a22] px-4 py-2 text-sm hover:bg-[#3a3019]">
              Ouvrir le cours
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

function PagePotions() {
  const potions = [
    {
      nom: "Potion de soin",
      icone: "❤️",
      description: "Restaure l'énergie du personnage.",
    },
    {
      nom: "Potion de sommeil",
      icone: "🌙",
      description: "Provoque un sommeil profond.",
    },
    {
      nom: "Potion de vision",
      icone: "👁️",
      description: "Améliore temporairement la perception.",
    },
  ];

  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl text-[#d6a928]">
          LIVRE DES POTIONS
        </h2>

        <p className="mt-1 text-gray-500">
          Recettes et ingrédients magiques
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {potions.map((potion) => (
          <article
            key={potion.nom}
            className="rounded-lg border border-[#54421f] bg-[#171923] p-6"
          >
            <div className="text-4xl">{potion.icone}</div>

            <h3 className="mt-4 text-xl text-[#e8b928]">
              {potion.nom}
            </h3>

            <p className="mt-2 text-gray-500">
              {potion.description}
            </p>

            <button className="mt-5 rounded border border-[#5e4a22] px-4 py-2 text-sm hover:bg-[#3a3019]">
              Voir la recette
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

function PageNotes({
  notes,
  setNotes,
}: {
  notes: string;
  setNotes: (texte: string) => void;
}) {
  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl text-[#d6a928]">
          MES NOTES
        </h2>

        <p className="mt-1 text-gray-500">
          Écrivez vos notes de cours
        </p>
      </header>

      <section className="rounded-lg border border-[#54421f] bg-[#171923] p-6">
        <label
          htmlFor="notes"
          className="mb-3 block text-[#e8b928]"
        >
          Carnet personnel
        </label>

        <textarea
          id="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="min-h-[500px] w-full resize-y rounded-lg border border-[#343744] bg-[#0f1119] p-5 leading-7 text-gray-200 outline-none focus:border-[#d6a928]"
        />

        <p className="mt-3 text-sm text-gray-500">
          Les notes restent enregistrées tant que la page reste ouverte.
        </p>
      </section>
    </>
  );
}

function Menu({
  icone,
  texte,
  actif,
  action,
}: {
  icone: string;
  texte: string;
  actif: boolean;
  action: () => void;
}) {
  return (
    <button
      onClick={action}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left ${
        actif
          ? "bg-[#3a3420] text-[#f2c438]"
          : "text-gray-300 hover:bg-white/5"
      }`}
    >
      <span>{icone}</span>
      <span>{texte}</span>
    </button>
  );
}

function Statistique({
  icone,
  valeur,
  texte,
}: {
  icone: string;
  valeur: string;
  texte: string;
}) {
  return (
    <article className="rounded-lg border border-[#54421f] bg-[#171923] p-6 text-center">
      <div className="text-2xl text-[#f2c438]">
        {icone}
      </div>

      <p className="mt-2 text-2xl">{valeur}</p>

      <p className="text-sm text-gray-500">{texte}</p>
    </article>
  );
}

function CarteMatiere({
  matiere,
  changerPoints,
}: {
  matiere: Matiere;
  changerPoints: (id: number, changement: number) => void;
}) {
  const progression = Math.round(
    (matiere.points / matiere.maximum) * 100
  );

  const restant = matiere.maximum - matiere.points;

  return (
    <article className="rounded-lg border border-[#54421f] bg-[#171923] p-5">
      <div className="mb-5 flex gap-3">
        <span className="text-2xl">{matiere.icone}</span>

        <div>
          <h4 className="text-lg uppercase">
            {matiere.nom}
          </h4>

          <span className="text-xs text-gray-500">
            {restant === 0 ? "Terminé" : "En cours"}
          </span>
        </div>
      </div>

      <Barre progression={progression} />

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xl text-[#e3b62d]">
          {matiere.points}
          <span className="text-sm text-gray-500">
            {" "}
            / {matiere.maximum}
          </span>
        </p>

        <div className="flex gap-2">
          <Bouton
            texte="-"
            action={() => changerPoints(matiere.id, -1)}
          />

          <Bouton
            texte="+"
            action={() => changerPoints(matiere.id, 1)}
          />

          <Bouton
            texte="+5"
            action={() => changerPoints(matiere.id, 5)}
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {restant === 0
          ? "Cours terminé"
          : `Il reste ${restant} points à obtenir`}
      </p>
    </article>
  );
}

function Barre({
  progression,
}: {
  progression: number;
}) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#292c39]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#d15f31] via-[#e18d27] to-[#f2c438] transition-all duration-300"
        style={{
          width: `${Math.min(100, Math.max(0, progression))}%`,
        }}
      />
    </div>
  );
}

function Bouton({
  texte,
  action,
}: {
  texte: string;
  action: () => void;
}) {
  return (
    <button
      onClick={action}
      className="h-8 min-w-8 rounded border border-[#5e4a22] bg-[#11131b] px-2 hover:bg-[#3a3019] hover:text-[#f2c438]"
    >
      {texte}
    </button>
  );
}