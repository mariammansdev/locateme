import type { IconType } from "react-icons";

export default function Regions({
  regions,
}: {
  regions: { key: string; count: number; icon: IconType; img: string; color: string }[];
}) {
  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-col gap-3">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
           Explore by Region
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-6">
        {regions.map((region) => {
          const Icon = region.icon;
          return (
            <div
              key={region.key}
              className="group relative overflow-hidden rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl backdrop-blur-lg"
            >
              <div className="h-48 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950" />
              <img className="absolute inset-x-0 top-0 h-48 " src={region.img} alt={region.key} />
                <div className="relative p-6 pt-8">
                  <div
                    className={`inline-flex absolute top-1 left-4 -translate-y-6 items-center justify-center rounded-full p-3 ${region.color} text-white shadow-lg`}
                  >
                    <Icon />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {region.key}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {region.count} Countries
                  </p>
                </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
