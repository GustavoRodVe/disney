import { NextResponse } from "next/server";
import { getSearchedMovies, getPopularMovies } from "@/lib/getMovies";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term") || undefined;

  // Return a structured list of movie suggestions (id, title, overview, poster_path, release_date)
  if (term) {
    const results = await getSearchedMovies(term);
    const payload = results.slice(0, 6).map((m) => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      poster_path: m.poster_path || m.backdrop_path || null,
      release_date: m.release_date || null,
    }));

    return NextResponse.json({ results: payload });
  }

  const popular = await getPopularMovies();
  const payload = popular.slice(0, 6).map((m) => ({
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster_path: m.poster_path || m.backdrop_path || null,
    release_date: m.release_date || null,
  }));

  return NextResponse.json({ results: payload });
}
