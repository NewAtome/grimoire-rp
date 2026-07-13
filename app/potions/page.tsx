import Link from "next/link";
import { potions } from "./data";

export default function PotionsPage() {
  return (
    <main className="min-h-screen bg-[#090b12] p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-[#e8b928]"
        >
          ← Retour à l'accueil
        </Link>

        <header className="mb-8 mt-5">
          <h1 className="text-4xl text-[#d6a928]">LIVRE DES POTIONS</h1>
          <p className="mt-2 text-gray-500">
            Consultez les recettes publiées par l'académie.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {potions.map((potion) => (
            <article
              key={potion.slug}
              className="rounded-xl border border-[#54421f] bg-[#171923] p-6"
            >
              <div className="text-4xl">{potion.icone}</div>

              <h2 className="mt-4 text-xl text-[#e8b928]">
                {potion.nom}
              </h2>

              <p className="mt-2 leading-6 text-gray-500">
                {potion.resume}
              </p>

              <Link
                href={`/potions/${potion.slug}`}
                className="mt-5 inline-block rounded border border-[#5e4a22] px-4 py-2 text-sm hover:bg-[#3a3019]"
              >
                Voir la recette
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
