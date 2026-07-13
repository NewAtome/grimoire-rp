import Link from "next/link";
import { notFound } from "next/navigation";
import { potions } from "../data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return potions.map((potion) => ({
    slug: potion.slug,
  }));
}

export default async function PotionDetailPage({ params }: Props) {
  const { slug } = await params;
  const potion = potions.find((element) => element.slug === slug);

  if (!potion) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#090b12] p-6 text-white md:p-10">
      <article className="mx-auto max-w-4xl rounded-2xl border border-[#54421f] bg-[#171923] p-6 md:p-10">
        <Link
          href="/potions"
          className="text-sm text-gray-400 hover:text-[#e8b928]"
        >
          ← Retour au livre des potions
        </Link>

        <header className="mt-6 border-b border-[#343744] pb-6">
          <div className="text-5xl">{potion.icone}</div>
          <h1 className="mt-4 text-4xl text-[#d6a928]">
            {potion.nom}
          </h1>
          <p className="mt-3 leading-7 text-gray-400">
            {potion.resume}
          </p>
        </header>

        <section className="mt-8">
          <h2 className="text-2xl text-[#e8b928]">Ingrédients</h2>
          <ul className="mt-4 space-y-3 text-gray-300">
            {potion.ingredients.map((ingredient) => (
              <li
                key={ingredient}
                className="rounded-lg bg-[#0f1119] px-4 py-3"
              >
                • {ingredient}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl text-[#e8b928]">Préparation</h2>
          <ol className="mt-4 space-y-3">
            {potion.preparation.map((etape, index) => (
              <li
                key={etape}
                className="flex gap-4 rounded-lg bg-[#0f1119] px-4 py-3 text-gray-300"
              >
                <span className="text-[#e8b928]">{index + 1}.</span>
                <span>{etape}</span>
              </li>
            ))}
          </ol>
        </section>

        {potion.observations && (
          <section className="mt-8 rounded-xl border border-[#54421f] bg-[#11131b] p-5">
            <h2 className="text-xl text-[#e8b928]">
              Observations
            </h2>
            <p className="mt-3 leading-7 text-gray-400">
              {potion.observations}
            </p>
          </section>
        )}
      </article>
    </main>
  );
}
