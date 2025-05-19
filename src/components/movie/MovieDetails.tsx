import { Movie } from "@/types/movie";
import { useTranslation } from "react-i18next";

// Props expected by the component
interface MovieDetailsProps {
  movie: Movie;
}

const MovieDetails = ({ movie }: MovieDetailsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      {/* Movie poster */}
      <div className="w-full md:w-80 flex-shrink-0">
        <img 
          src={movie.posterUrl} 
          alt={`${movie.title} Poster`} 
          className="w-full h-[400px] md:h-[500px] rounded-lg shadow-lg aspect-[2/3] object-cover"
        />
      </div>
      
      {/* Movie information: age rating, viewer rating */}
      <div className="flex-1">
        <h1 className="text-5xl font-bold text-white mb-1 break-words">
          {t(`movies.${movie.id.toString().includes('f') ? movie.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') : movie.id}`)}
        </h1>
        <p className="section-description mb-4 break-words">
          {t(`movies.${movie.id.toString().includes('f') ? movie.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') : movie.id}`)}
        </p>
        <div className="flex gap-3 mt-4 whitespace-nowrap mb-6 items-center">
          <span className="px-3 py-2 font-bold rounded-xl border-2 border-solid border-neutral-400 text-neutral-400">
            {movie.ageRating}
          </span>
          <span className="px-3.5 py-2 font-extrabold text-center text-amber-300 rounded-md bg-stone-800">
            {movie.rating}
          </span>
        </div>
        
        {/* Movie information: genres, release year, runtime, cast */}
        <div className="space-y-1 text-sm">
          <div className="flex">
            <span className="font-medium text-medium-grey w-32">{t('movies.genres')}:</span>
            <span>{movie.genres.map(genre => t(`genres.${genre.toLowerCase()}`)).join(", ")}</span>
          </div>
          <div className="flex">
            <span className="font-medium text-medium-grey w-32">{t('movies.releaseYear')}:</span>
            <span>{movie.releaseYear}</span>
          </div>
          <div className="flex">
            <span className="font-medium text-medium-grey w-32">{t('movies.duration')}:</span>
            <span>{movie.runtime}</span>
          </div>
          <div className="flex">
            <span className="font-medium text-medium-grey w-32">{t('movies.cast')}:</span>
            <span>{movie.cast.join(", ")}</span>
          </div>
        </div>
        
        {/* Movie description */}
        <p className="mt-6 movie-description text-sm font-medium leading-relaxed">
          {t(`movies.description${movie.id.toString().includes('f') ? movie.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') : movie.id}`, {defaultValue: movie.description})}
        </p>
      </div>
    </div>
  );
};

export default MovieDetails;
