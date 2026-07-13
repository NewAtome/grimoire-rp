"use client";

import { useEffect, useMemo, useState } from "react";

type Matiere = {
  id: number;
  nom: string;
  icone: string;
  points: number;
  maximum: number;
};

type PageActive = "accueil" | "jetons" | "cours" | "potions" | "notes" | "reglement";

type PageDeCours = {
  id: number;
  titre: string;
  contenu: string;
};

type PageRecette = {
  id: number;
  titre: string;
  ingredients: string;
  preparation: string;
  notes: string;
};

type PagesParCours = Record<string, PageDeCours[]>;

const annee1: Matiere[] = [
  { id: 1, nom: "Alchimie - Botanique", icone: "🌿", points: 0, maximum: 30 },
  { id: 2, nom: "Sorts", icone: "✨", points: 0, maximum: 40 },
  { id: 3, nom: "Potions", icone: "🧪", points: 0, maximum: 20 },
  { id: 4, nom: "Histoire de la magie", icone: "📜", points: 0, maximum: 20 },
  { id: 5, nom: "Créatures magiques", icone: "🐉", points: 0, maximum: 20 },
  { id: 6, nom: "Club", icone: "🏆", points: 0, maximum: 10 },
  { id: 7, nom: "Divers", icone: "⚡", points: 0, maximum: 40 },
];

const annee2: Matiere[] = [
  { id: 101, nom: "Alchimie - Botanique", icone: "🌿", points: 0, maximum: 20 },
  { id: 102, nom: "Sorts", icone: "✨", points: 0, maximum: 40 },
  { id: 103, nom: "Potions", icone: "🧪", points: 0, maximum: 15 },
  { id: 104, nom: "Histoire de la magie", icone: "📜", points: 0, maximum: 30 },
  { id: 105, nom: "Créatures magiques", icone: "🐉", points: 0, maximum: 25 },
  { id: 106, nom: "Club", icone: "🏆", points: 0, maximum: 20 },
  { id: 107, nom: "Divers", icone: "⚡", points: 0, maximum: 50 },
];

function cleCours(annee: 1 | 2, matiereId: number) {
  return `${annee}-${matiereId}`;
}

export default function Home() {
  const [pageActive, setPageActive] = useState<PageActive>("accueil");
  const [anneeActive, setAnneeActive] = useState<1 | 2>(1);
  const [matieresAnnee1, setMatieresAnnee1] = useState<Matiere[]>(annee1);
  const [matieresAnnee2, setMatieresAnnee2] = useState<Matiere[]>(annee2);
  const [coursOuvert, setCoursOuvert] = useState<Matiere | null>(null);
  const [pageCoursActive, setPageCoursActive] = useState<number | null>(null);
  const [pagesParCours, setPagesParCours] = useState<PagesParCours>({});
  const [notes, setNotes] = useState("Écris ici tes notes personnelles...");

  useEffect(() => {
    const sauvegarde = localStorage.getItem("grimoire-pages-cours");
    if (sauvegarde) {
      try {
        setPagesParCours(JSON.parse(sauvegarde));
      } catch {
        // On ignore une sauvegarde invalide.
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("grimoire-pages-cours", JSON.stringify(pagesParCours));
  }, [pagesParCours]);

  const matieres =
    anneeActive === 1 ? matieresAnnee1 : matieresAnnee2;

  const totalPoints = useMemo(
    () => matieres.reduce((total, matiere) => total + matiere.points, 0),
    [matieres]
  );

  const totalMaximum = useMemo(
    () => matieres.reduce((total, matiere) => total + matiere.maximum, 0),
    [matieres]
  );

  const coursTermines = matieres.filter(
    (matiere) => matiere.points >= matiere.maximum
  ).length;

  const progression =
    totalMaximum === 0 ? 0 : Math.round((totalPoints / totalMaximum) * 100);

  function changerPoints(id: number, changement: number) {
    const modifier = (liste: Matiere[]) =>
      liste.map((matiere) =>
        matiere.id === id
          ? {
              ...matiere,
              points: Math.min(
                matiere.maximum,
                Math.max(0, matiere.points + changement)
              ),
            }
          : matiere
      );

    if (anneeActive === 1) {
      setMatieresAnnee1(modifier);
    } else {
      setMatieresAnnee2(modifier);
    }
  }

  function reinitialiser() {
    if (!window.confirm("Réinitialiser les points de cette année ?")) return;
    if (anneeActive === 1) setMatieresAnnee1(annee1);
    else setMatieresAnnee2(annee2);
  }

  function ouvrirCours(matiere: Matiere) {
    const cle = cleCours(anneeActive, matiere.id);
    const pages = pagesParCours[cle] ?? [];

    setCoursOuvert(matiere);
    setPageCoursActive(pages[0]?.id ?? null);
  }

  function ajouterPageCours() {
    if (!coursOuvert) return;

    const cle = cleCours(anneeActive, coursOuvert.id);
    const nouvellePage: PageDeCours = {
      id: Date.now(),
      titre: `Nouvelle page ${(pagesParCours[cle]?.length ?? 0) + 1}`,
      contenu: "",
    };

    setPagesParCours((ancien) => ({
      ...ancien,
      [cle]: [...(ancien[cle] ?? []), nouvellePage],
    }));
    setPageCoursActive(nouvellePage.id);
  }

  function modifierPageCours(
    champ: "titre" | "contenu",
    valeur: string
  ) {
    if (!coursOuvert || pageCoursActive === null) return;

    const cle = cleCours(anneeActive, coursOuvert.id);

    setPagesParCours((ancien) => ({
      ...ancien,
      [cle]: (ancien[cle] ?? []).map((page) =>
        page.id === pageCoursActive ? { ...page, [champ]: valeur } : page
      ),
    }));
  }

  function supprimerPageCours() {
    if (!coursOuvert || pageCoursActive === null) return;
    if (!window.confirm("Supprimer cette page de cours ?")) return;

    const cle = cleCours(anneeActive, coursOuvert.id);
    const nouvellesPages = (pagesParCours[cle] ?? []).filter(
      (page) => page.id !== pageCoursActive
    );

    setPagesParCours((ancien) => ({
      ...ancien,
      [cle]: nouvellesPages,
    }));
    setPageCoursActive(nouvellesPages[0]?.id ?? null);
  }

  const cleCoursOuvert = coursOuvert
    ? cleCours(anneeActive, coursOuvert.id)
    : "";

  const pagesCoursOuvert = coursOuvert
    ? pagesParCours[cleCoursOuvert] ?? []
    : [];

  const pageSelectionnee =
    pagesCoursOuvert.find((page) => page.id === pageCoursActive) ?? null;

  return (
    <div className="min-h-screen bg-[#090b12] text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-60 border-r border-[#292b35] bg-[#12141d] md:block">
        <div className="border-b border-[#292b35] p-5">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📚</div>
            <div>
              <h1 className="text-xl text-[#d6a928]">SEVEN WANDS</h1>
              <p className="text-xs text-gray-500">Académie magique</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
            Navigation
          </p>

          <div className="space-y-2">
            <Menu
              actif={pageActive === "accueil"}
              icone="🏰"
              texte="Accueil"
              action={() => {
                setPageActive("accueil");
                setCoursOuvert(null);
              }}
            />

            <Menu
              actif={pageActive === "jetons"}
              icone="🪙"
              texte="Jetons"
              action={() => {
                setPageActive("jetons");
                setCoursOuvert(null);
              }}
            />
            <Menu
              actif={pageActive === "cours"}
              icone="📖"
              texte="Cours"
              action={() => {
                setPageActive("cours");
                setCoursOuvert(null);
              }}
            />
            <Menu
              actif={false}
              icone="🧪"
              texte="Potions"
              action={() => {
                window.location.href = "/potions";
              }}
            />
            <Menu
              actif={pageActive === "notes"}
              icone="🪶"
              texte="Mes notes"
              action={() => {
                setPageActive("notes");
                setCoursOuvert(null);
              }}
            />

            <Menu
              actif={pageActive === "reglement"}
              icone="📜"
              texte="Règlement"
              action={() => {
                setPageActive("reglement");
                setCoursOuvert(null);
              }}
            />
          </div>
        </nav>
      </aside>

      <main className="p-6 md:ml-60 md:p-8">
        {pageActive === "accueil" && <PageAccueil />}

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

        {pageActive === "cours" && !coursOuvert && (
          <PageCours
            matieres={matieres}
            anneeActive={anneeActive}
            setAnneeActive={setAnneeActive}
            ouvrirCours={ouvrirCours}
          />
        )}

        {pageActive === "cours" && coursOuvert && (
          <EditeurCours
            matiere={coursOuvert}
            anneeActive={anneeActive}
            pages={pagesCoursOuvert}
            pageActive={pageCoursActive}
            pageSelectionnee={pageSelectionnee}
            retour={() => {
              setCoursOuvert(null);
              setPageCoursActive(null);
            }}
            choisirPage={setPageCoursActive}
            ajouterPage={ajouterPageCours}
            modifierPage={modifierPageCours}
            supprimerPage={supprimerPageCours}
          />
        )}

        {pageActive === "potions" && <PagePotions />}

        {pageActive === "notes" && (
          <PageNotes notes={notes} setNotes={setNotes} />
        )}

        {pageActive === "reglement" && <PageReglement />}
      </main>
    </div>
  );
}


function PageAccueil() {
  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-[#54421f] bg-gradient-to-br from-[#171923] via-[#11131b] to-[#090b12] p-8 md:p-12">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#8d7a48]">
            Bienvenue à l&apos;Académie
          </p>

          <h2 className="text-4xl font-semibold text-[#e8b928] md:text-6xl">
            Le Grimoire des élèves
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Ce site rassemble les cours, les notes, les recettes de potions
            et la progression des élèves de l&apos;académie magique.
          </p>

          <p className="mt-4 max-w-2xl leading-7 text-gray-500">
            Consulte les matières, ouvre un cours pour écrire plusieurs pages,
            garde tes notes personnelles et retrouve le règlement du serveur.
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <CarteAccueil
          icone="📚"
          titre="Cours"
          texte="Retrouve chaque matière et crée autant de pages de cours que nécessaire."
        />
        <CarteAccueil
          icone="🪙"
          titre="Progression"
          texte="Suis les jetons et les objectifs de première et deuxième année."
        />
        <CarteAccueil
          icone="📜"
          titre="Règlement"
          texte="Consulte les règles importantes pour garder un RP agréable et cohérent."
        />
      </section>

      <section className="mt-6 rounded-xl border border-[#54421f] bg-[#171923] p-6">
        <h3 className="text-2xl text-[#e8b928]">À propos du serveur</h3>
        <p className="mt-3 max-w-4xl leading-7 text-gray-400">
          Notre serveur propose une expérience de roleplay magique centrée sur
          la vie scolaire, les cours, les clubs, les aventures et l&apos;évolution
          des personnages. Chaque élève est invité à participer avec respect,
          créativité et cohérence.
        </p>
      </section>
    </>
  );
}

function CarteAccueil({
  icone,
  titre,
  texte,
}: {
  icone: string;
  titre: string;
  texte: string;
}) {
  return (
    <article className="rounded-xl border border-[#54421f] bg-[#171923] p-6">
      <div className="text-4xl">{icone}</div>
      <h3 className="mt-4 text-xl text-[#e8b928]">{titre}</h3>
      <p className="mt-2 leading-6 text-gray-500">{texte}</p>
    </article>
  );
}

function PageReglement() {
  const regles = [
    {
      titre: "Respect",
      texte:
        "Respecte tous les joueurs et les membres du staff. Les insultes, le harcèlement et les discriminations sont interdits.",
    },
    {
      titre: "Cohérence RP",
      texte:
        "Reste cohérent avec ton personnage et l’univers du serveur. Évite les actions impossibles ou sans conséquence.",
    },
    {
      titre: "Fair-play",
      texte:
        "N’utilise pas d’informations apprises hors RP. Laisse aux autres le temps de répondre et accepte les conséquences de tes actions.",
    },
    {
      titre: "Cours et événements",
      texte:
        "Pendant les cours et les événements, écoute les professeurs et respecte les consignes données en jeu.",
    },
    {
      titre: "Contenu approprié",
      texte:
        "Garde un contenu adapté à la communauté. Les contenus choquants, illégaux ou explicitement sexuels sont interdits.",
    },
    {
      titre: "Décisions du staff",
      texte:
        "En cas de problème, contacte le staff calmement. Les décisions doivent être discutées en privé, sans perturber le RP.",
    },
  ];

  return (
    <>
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[#8d7a48]">
          Vie de l&apos;académie
        </p>
        <h2 className="mt-2 text-4xl text-[#d6a928]">RÈGLEMENT</h2>
        <p className="mt-2 max-w-3xl text-gray-500">
          Ces règles permettent de garder une ambiance agréable, immersive et
          respectueuse pour tous.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {regles.map((regle, index) => (
          <article
            key={regle.titre}
            className="rounded-xl border border-[#54421f] bg-[#171923] p-6"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#6d5526] bg-[#11131b] text-[#f2c438]">
                {index + 1}
              </div>

              <div>
                <h3 className="text-xl text-[#e8b928]">{regle.titre}</h3>
                <p className="mt-2 leading-7 text-gray-400">{regle.texte}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-red-900/60 bg-red-950/10 p-6">
        <h3 className="text-xl text-red-300">Important</h3>
        <p className="mt-2 leading-7 text-red-200/70">
          Le règlement peut évoluer. En restant sur le serveur, chaque membre
          accepte de respecter les règles en vigueur et les consignes du staff.
        </p>
      </section>
    </>
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
          <h2 className="text-3xl text-[#d6a928]">SUIVI DES JETONS</h2>
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

      <OngletsAnnees
        anneeActive={anneeActive}
        setAnneeActive={setAnneeActive}
      />

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
        <Statistique icone="⚠" valeur="0" texte="Haute priorité" />
      </section>

      <section className="mb-7">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h3 className="text-2xl text-[#d6a928]">
              {anneeActive === 1 ? "PREMIÈRE ANNÉE" : "DEUXIÈME ANNÉE"}
            </h3>
            <p className="text-gray-500">
              {coursTermines}/{matieres.length} cours complétés
            </p>
          </div>

          <div className="text-right">
            <p className="text-xl text-[#d6a928]">
              {totalPoints}
              <span className="text-gray-500"> / {totalMaximum}</span>
            </p>
            <p className="text-xs text-gray-500">points totaux</p>
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
  setAnneeActive,
  ouvrirCours,
}: {
  matieres: Matiere[];
  anneeActive: 1 | 2;
  setAnneeActive: (annee: 1 | 2) => void;
  ouvrirCours: (matiere: Matiere) => void;
}) {
  return (
    <>
      <header className="mb-6">
        <h2 className="text-3xl text-[#d6a928]">MES COURS</h2>
        <p className="mt-1 text-gray-500">
          Choisissez une matière puis créez autant de pages que nécessaire.
        </p>
      </header>

      <OngletsAnnees
        anneeActive={anneeActive}
        setAnneeActive={setAnneeActive}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matieres.map((matiere) => (
          <article
            key={matiere.id}
            className="rounded-lg border border-[#54421f] bg-[#171923] p-6"
          >
            <div className="text-4xl">{matiere.icone}</div>
            <h3 className="mt-4 text-xl text-[#e8b928]">{matiere.nom}</h3>
            <p className="mt-2 text-sm text-gray-500">
              Ouvrez le cours pour écrire plusieurs pages.
            </p>
            <button
              onClick={() => ouvrirCours(matiere)}
              className="mt-5 rounded border border-[#5e4a22] px-4 py-2 text-sm hover:bg-[#3a3019]"
            >
              Ouvrir le cours
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

function EditeurCours({
  matiere,
  anneeActive,
  pages,
  pageActive,
  pageSelectionnee,
  retour,
  choisirPage,
  ajouterPage,
  modifierPage,
  supprimerPage,
}: {
  matiere: Matiere;
  anneeActive: 1 | 2;
  pages: PageDeCours[];
  pageActive: number | null;
  pageSelectionnee: PageDeCours | null;
  retour: () => void;
  choisirPage: (id: number) => void;
  ajouterPage: () => void;
  modifierPage: (champ: "titre" | "contenu", valeur: string) => void;
  supprimerPage: () => void;
}) {
  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={retour}
            className="mb-3 text-sm text-gray-400 hover:text-[#e8b928]"
          >
            ← Retour aux cours
          </button>
          <h2 className="text-3xl text-[#d6a928]">
            {matiere.icone} {matiere.nom}
          </h2>
          <p className="mt-1 text-gray-500">
            {anneeActive === 1 ? "Première année" : "Deuxième année"}
          </p>
        </div>

        <button
          onClick={ajouterPage}
          className="rounded-md bg-[#d6a928] px-4 py-2 font-medium text-black hover:bg-[#f2c438]"
        >
          + Nouvelle page
        </button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-lg border border-[#54421f] bg-[#171923] p-4">
          <h3 className="mb-3 text-sm uppercase tracking-widest text-gray-500">
            Pages du cours
          </h3>

          {pages.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucune page. Clique sur « Nouvelle page ».
            </p>
          ) : (
            <div className="space-y-2">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => choisirPage(page.id)}
                  className={`w-full rounded-md px-3 py-3 text-left ${
                    pageActive === page.id
                      ? "bg-[#3a3420] text-[#f2c438]"
                      : "bg-[#10121a] text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <span className="mr-2 text-gray-500">{index + 1}.</span>
                  {page.titre || "Page sans titre"}
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="rounded-lg border border-[#54421f] bg-[#171923] p-5">
          {!pageSelectionnee ? (
            <div className="grid min-h-[500px] place-items-center text-center">
              <div>
                <div className="text-5xl">📄</div>
                <p className="mt-4 text-gray-400">
                  Crée une page pour commencer à écrire ton cours.
                </p>
              </div>
            </div>
          ) : (
            <>
              <input
                value={pageSelectionnee.titre}
                onChange={(event) =>
                  modifierPage("titre", event.target.value)
                }
                placeholder="Titre de la page"
                className="w-full border-b border-[#343744] bg-transparent pb-3 text-2xl text-[#e8b928] outline-none focus:border-[#d6a928]"
              />

              <textarea
                value={pageSelectionnee.contenu}
                onChange={(event) =>
                  modifierPage("contenu", event.target.value)
                }
                placeholder="Écris ici tout le contenu de ton cours..."
                className="mt-5 min-h-[520px] w-full resize-y rounded-lg border border-[#343744] bg-[#0f1119] p-5 leading-7 text-gray-200 outline-none focus:border-[#d6a928]"
              />

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Sauvegarde automatique dans ce navigateur.
                </p>
                <button
                  onClick={supprimerPage}
                  className="rounded border border-red-900 px-4 py-2 text-sm text-red-400 hover:bg-red-950/40"
                >
                  Supprimer la page
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}

function OngletsAnnees({
  anneeActive,
  setAnneeActive,
}: {
  anneeActive: 1 | 2;
  setAnneeActive: (annee: 1 | 2) => void;
}) {
  return (
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
  );
}

function PagePotions() {
  const [recettes, setRecettes] = useState<PageRecette[]>([]);
  const [recetteActive, setRecetteActive] = useState<number | null>(null);

  useEffect(() => {
    const sauvegarde = localStorage.getItem("seven-wands-recettes");

    if (sauvegarde) {
      try {
        const recettesSauvegardees: PageRecette[] = JSON.parse(sauvegarde);
        setRecettes(recettesSauvegardees);
        setRecetteActive(recettesSauvegardees[0]?.id ?? null);
      } catch {
        // On ignore une sauvegarde invalide.
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("seven-wands-recettes", JSON.stringify(recettes));
  }, [recettes]);

  const recetteSelectionnee =
    recettes.find((recette) => recette.id === recetteActive) ?? null;

  function ajouterRecette() {
    const nouvelleRecette: PageRecette = {
      id: Date.now(),
      titre: `Nouvelle recette ${recettes.length + 1}`,
      ingredients: "",
      preparation: "",
      notes: "",
    };

    setRecettes((anciennesRecettes) => [
      ...anciennesRecettes,
      nouvelleRecette,
    ]);
    setRecetteActive(nouvelleRecette.id);
  }

  function modifierRecette(
    champ: "titre" | "ingredients" | "preparation" | "notes",
    valeur: string
  ) {
    if (recetteActive === null) return;

    setRecettes((anciennesRecettes) =>
      anciennesRecettes.map((recette) =>
        recette.id === recetteActive
          ? { ...recette, [champ]: valeur }
          : recette
      )
    );
  }

  function supprimerRecette() {
    if (recetteActive === null) return;
    if (!window.confirm("Supprimer cette recette ?")) return;

    const nouvellesRecettes = recettes.filter(
      (recette) => recette.id !== recetteActive
    );

    setRecettes(nouvellesRecettes);
    setRecetteActive(nouvellesRecettes[0]?.id ?? null);
  }

  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl text-[#d6a928]">LIVRE DES POTIONS</h2>
          <p className="mt-1 text-gray-500">
            Créez vos propres pages de recettes et de recherches.
          </p>
        </div>

        <button
          onClick={ajouterRecette}
          className="rounded-md bg-[#d6a928] px-4 py-2 font-medium text-black hover:bg-[#f2c438]"
        >
          + Nouvelle recette
        </button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-lg border border-[#54421f] bg-[#171923] p-4">
          <h3 className="mb-3 text-sm uppercase tracking-widest text-gray-500">
            Mes recettes
          </h3>

          {recettes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#54421f] p-4 text-center">
              <div className="text-4xl">🧪</div>
              <p className="mt-3 text-sm text-gray-500">
                Aucune recette pour le moment.
              </p>
              <button
                onClick={ajouterRecette}
                className="mt-4 rounded border border-[#5e4a22] px-3 py-2 text-sm hover:bg-[#3a3019]"
              >
                Créer ma première recette
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recettes.map((recette, index) => (
                <button
                  key={recette.id}
                  onClick={() => setRecetteActive(recette.id)}
                  className={`w-full rounded-md px-3 py-3 text-left ${
                    recetteActive === recette.id
                      ? "bg-[#3a3420] text-[#f2c438]"
                      : "bg-[#10121a] text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <span className="mr-2 text-gray-500">{index + 1}.</span>
                  {recette.titre || "Recette sans titre"}
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="rounded-lg border border-[#54421f] bg-[#171923] p-5">
          {!recetteSelectionnee ? (
            <div className="grid min-h-[560px] place-items-center text-center">
              <div>
                <div className="text-6xl">⚗️</div>
                <p className="mt-4 text-lg text-gray-300">
                  Crée une recette pour commencer.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Tu pourras écrire les ingrédients, les étapes et tes recherches.
                </p>
              </div>
            </div>
          ) : (
            <>
              <input
                value={recetteSelectionnee.titre}
                onChange={(event) =>
                  modifierRecette("titre", event.target.value)
                }
                placeholder="Nom de la potion"
                className="w-full border-b border-[#343744] bg-transparent pb-3 text-2xl text-[#e8b928] outline-none focus:border-[#d6a928]"
              />

              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm uppercase tracking-widest text-[#8d7a48]">
                    Ingrédients
                  </label>
                  <textarea
                    value={recetteSelectionnee.ingredients}
                    onChange={(event) =>
                      modifierRecette("ingredients", event.target.value)
                    }
                    placeholder={"Exemple :\n- 3 feuilles de mandragore\n- 1 fiole d'eau de lune"}
                    className="min-h-[220px] w-full resize-y rounded-lg border border-[#343744] bg-[#0f1119] p-4 leading-7 text-gray-200 outline-none focus:border-[#d6a928]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm uppercase tracking-widest text-[#8d7a48]">
                    Préparation
                  </label>
                  <textarea
                    value={recetteSelectionnee.preparation}
                    onChange={(event) =>
                      modifierRecette("preparation", event.target.value)
                    }
                    placeholder={"Exemple :\n1. Chauffer le chaudron.\n2. Ajouter les ingrédients."}
                    className="min-h-[220px] w-full resize-y rounded-lg border border-[#343744] bg-[#0f1119] p-4 leading-7 text-gray-200 outline-none focus:border-[#d6a928]"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm uppercase tracking-widest text-[#8d7a48]">
                  Recherches et observations
                </label>
                <textarea
                  value={recetteSelectionnee.notes}
                  onChange={(event) =>
                    modifierRecette("notes", event.target.value)
                  }
                  placeholder="Ajoute ici les effets, les essais, les erreurs et les résultats..."
                  className="min-h-[220px] w-full resize-y rounded-lg border border-[#343744] bg-[#0f1119] p-4 leading-7 text-gray-200 outline-none focus:border-[#d6a928]"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Sauvegarde automatique dans ce navigateur.
                </p>

                <button
                  onClick={supprimerRecette}
                  className="rounded border border-red-900 px-4 py-2 text-sm text-red-400 hover:bg-red-950/40"
                >
                  Supprimer la recette
                </button>
              </div>
            </>
          )}
        </section>
      </div>
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
        <h2 className="text-3xl text-[#d6a928]">MES NOTES</h2>
        <p className="mt-1 text-gray-500">Écrivez vos notes personnelles</p>
      </header>

      <section className="rounded-lg border border-[#54421f] bg-[#171923] p-6">
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="min-h-[500px] w-full resize-y rounded-lg border border-[#343744] bg-[#0f1119] p-5 leading-7 text-gray-200 outline-none focus:border-[#d6a928]"
        />
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
      <div className="text-2xl text-[#f2c438]">{icone}</div>
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
          <h4 className="text-lg uppercase">{matiere.nom}</h4>
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
          <PetitBouton
            texte="-"
            action={() => changerPoints(matiere.id, -1)}
          />
          <PetitBouton
            texte="+"
            action={() => changerPoints(matiere.id, 1)}
          />
          <PetitBouton
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

function Barre({ progression }: { progression: number }) {
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

function PetitBouton({
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