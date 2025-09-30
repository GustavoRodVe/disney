"use client";

import useSWR from "swr";
import Image from "next/image";
import getImagePath from "@/lib/getImagePath";

const fetcher = (term: string) =>
  fetch("/api/suggestions?term=" + encodeURIComponent(term)).then((res) =>
    res.json()
  );

function AISuggestion({ term }: { term: string }) {
  const { data, error, isLoading } = useSWR(
    term ? ["suggestions", term] : null,
    () => fetcher(term),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  if (!term) return null;

  if (isLoading)
    return (
      <div className="px-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
        <p className="text-sm text-gray-400">Cargando sugerencias...</p>
      </div>
    );

  if (error) return <div className="px-10">Error al cargar sugerencias</div>;

  if (!data || !data.results) return <div className="px-10">No hay sugerencias</div>;

  const movies = data.results as Array<{
    id: number;
    title: string;
    overview?: string;
    poster_path?: string | null;
    release_date?: string | null;
  }>;

  return (
    <div className="px-10">
  <h3 className="text-2xl font-semibold">Sugerencias para ti</h3>
  <p className="text-sm text-gray-400 mb-4">Recomendadas de TMDB</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((m) => (
          <a
            key={m.id}
            href={`https://www.themoviedb.org/movie/${m.id}`}
            target="_blank"
            rel="noreferrer"
            className="block p-3 bg-white/5 rounded-md hover:scale-105 transition-transform"
          >
            <div className="flex items-start space-x-3">
              {m.poster_path ? (
                <Image
                  src={getImagePath(m.poster_path)}
                  alt={m.title}
                  width={120}
                  height={80}
                  className="rounded-sm"
                />
              ) : (
                <div className="w-28 h-16 bg-gray-700 rounded-sm" />
              )}

              <div>
                <p className="font-bold">{m.title}</p>
                <p className="text-sm text-gray-300">{m.release_date?.split("-")[0]}</p>
                <p className="text-sm mt-2 text-gray-400">{m.overview?.slice(0, 100)}{m.overview && m.overview.length > 100 ? '…' : ''}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default AISuggestion;
