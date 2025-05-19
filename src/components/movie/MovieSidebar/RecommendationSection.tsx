import RecommendationCard from "./RecommendationCard";
import { Movie } from "@/types/movie";
import { useTranslation } from "react-i18next";

interface RecommendationsSectionProps {
  recommendations: Movie[];
}

const RecommendationsSection = ({ recommendations }: RecommendationsSectionProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-8">
      <h3 className="text-lg text-medium-grey font-bold">{t('movies.recommendations')}</h3>
      <div className="text-xs section-description font-normal mb-4">
        {t('movies.recommendedMovies')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {recommendations.map((movie) => (
          <RecommendationCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;
