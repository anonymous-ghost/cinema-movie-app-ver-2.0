import { useState, useEffect } from "react";
import { Film } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { useFavorites } from "../contexts/FavoritesContext";
import { useTranslation } from "react-i18next";

interface FilmsCardProps {
  film?: Film;
}

const FilmsCard: React.FC<FilmsCardProps> = ({ film }) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const navigate = useNavigate();
  const { t } = useTranslation();

  
  if (!film) {
    return null; // Don't render anything if no film is provided
  }

  const isFilmFavorite = isFavorite(film.id);

  // Додавання або видалення фільму з обраних
  const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({ 
        title: "Authentication required", 
        description: "Please login to add movies to favorites", 
        variant: "destructive" 
      });
      return;
    }
    
    try {
      if (isFilmFavorite) {
        // Remove from favorites
        removeFromFavorites(film.id);
        toast({ 
          title: "Removed from favorites", 
          description: `${film.title} has been removed from your favorites`
        });
      } else {
        // Add to favorites
        addToFavorites(film);
        toast({ 
          title: "Added to favorites", 
          description: `${film.title} has been added to your favorites`
        });
      }
    } catch (error) {
      console.error("Error managing favorites:", error);
    }
  };

  return (
    <Link to={`/movie/${film.id}`} className="films-card">
      <div className="poster-container">
        <img src={film.posterUrl} alt={film.title} />
        <div className="heart-background">
          <button
            onClick={toggleFavorite}
            className={isFilmFavorite ? "toggle-heart liked" : "toggle-heart"}
            id="toggle-heart"
            aria-label="like"
          >
            ❤
          </button>
        </div>
        {film.isNew && <div className="new-release-tag">NEW</div>}
      </div>
      <div className="films-info-card">
        <span className="film-name">{t(`movies.${film.id.includes('f') ? film.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') : film.id}`)}</span>
        <div className="movie-rating">
          <span>&#9733;</span>
          <span>{film.rating}</span>
        </div>
        <div className="film-category">
          {film.genres.slice(0, 3).map((genre, index) => (
            <span key={index} className="name-category">{t(`genres.${genre.toLowerCase()}`)}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default FilmsCard;
