import CarouselBannerWrapper from "@/components/CarouselBannerWrapper";
import MoviesCarousel from "@/components/MoviesCarousel";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/lib/getMovies";

export default async function Home() {
  const upcomingMovies = await getUpcomingMovies();
  const topRatedMovies = await getTopRatedMovies();
  const popularMovies = await getPopularMovies();

  return (
    <main className="">
      <CarouselBannerWrapper />

      <div className="flex flex-col space-y-2 xl:-mt-48">
  <MoviesCarousel movies={upcomingMovies} title="Próximas" />
  <MoviesCarousel movies={topRatedMovies} title="Más valoradas" />
  <MoviesCarousel movies={popularMovies} title="Populares" />
      </div>
    </main>
  );
}
