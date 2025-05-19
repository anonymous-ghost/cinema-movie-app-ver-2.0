import "../styles/Page.css";
import "../styles/animations.css";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t } = useTranslation();

  return (
    <main>
      <div className="page-container">
        <h1 className="page-title animate-glow">{t('terms.title')}</h1>
        
        <div className="page-section animate-slideInUp delay-100">
          <h2>1. {t('terms.acceptance')}</h2>
          <p>
            {t('terms.acceptanceText1')}
          </p>
          <p>
            {t('terms.acceptanceText2')}
          </p>
        </div>
        
        <div className="page-section animate-slideInUp delay-200">
          <h2>2. {t('terms.services')}</h2>
          <p>
            {t('terms.servicesText')}
          </p>
          <ul>
            <li>{t('movies.description')}</li>
            <li>{t('common.profile')}</li>
            <li>{t('common.bookTickets')}</li>
            <li>{t('movies.reviews')}</li>
            <li>{t('home.featured')}</li>
            <li>{t('favorites.myFavorites')}</li>
          </ul>
          <p>
            {t('terms.changesText')}
          </p>
        </div>
        
        <div className="page-section animate-slideInUp delay-300">
          <h2>3. {t('terms.userAccounts')}</h2>
          <p>
            {t('terms.userAccountsText1')}
          </p>
          <p>
            {t('terms.userAccountsText2')}
          </p>
          <ul>
            <li>{t('auth.authRequired')}</li>
            <li>{t('auth.signInNow')}</li>
            <li>{t('auth.requiredField')}</li>
            <li>{t('terms.userAccountsText1')}</li>
          </ul>
          <p>
            {t('terms.changesText')}
          </p>
        </div>
        
        <div className="page-section animate-slideInUp delay-400">
          <h2>4. {t('terms.tickets')}</h2>
          <p>
            {t('terms.ticketsText1')}
          </p>
          <p>
            {t('terms.ticketsText2')}
          </p>
          <p>
            {t('terms.ticketsText3')}
          </p>
        </div>
        
        <div className="page-section animate-slideInUp delay-500">
          <h2>5. {t('terms.userContent')}</h2>
          <p>
            {t('terms.userContentText1')}
          </p>
          <p>
            {t('terms.userContentText2')}
          </p>
          <ul>
            <li>{t('movies.reviews')}</li>
            <li>{t('movies.rating')}</li>
            <li>{t('terms.servicesText')}</li>
          </ul>
          <p>
            {t('terms.changesText')}
          </p>
        </div>
        
        <div className="page-section animate-slideInUp">
          <h2>6. {t('terms.prohibited')}</h2>
          <p>
            {t('terms.prohibitedText')}
          </p>
          <ul>
            <li>{t('auth.authRequired')}</li>
            <li>{t('terms.userAccountsText1')}</li>
            <li>{t('terms.servicesText')}</li>
            <li>{t('terms.prohibited')}</li>
            <li>{t('terms.changesText')}</li>
            <li>{t('terms.prohibitedText')}</li>
            <li>{t('terms.userContentText1')}</li>
            <li>{t('terms.userContentText2')}</li>
          </ul>
        </div>
        
        <div className="page-section animate-slideInUp">
          <h2>7. {t('terms.intellectual')}</h2>
          <p>
            {t('terms.intellectualText1')}
          </p>
          <p>
            {t('terms.intellectualText2')}
          </p>
          <ul>
            <li>{t('terms.servicesText')}</li>
            <li>{t('terms.prohibited')}</li>
            <li>{t('terms.userContentText1')}</li>
            <li>{t('terms.intellectual')}</li>
            <li>{t('terms.intellectualText1')}</li>
          </ul>
        </div>
        
        <div className="page-section animate-slideInUp">
          <h2>8. {t('terms.disclaimer')}</h2>
          <p>
            {t('terms.disclaimerText1')}
          </p>
          <p>
            {t('terms.disclaimerText2')}
          </p>
        </div>
        
        <div className="page-section animate-slideInUp">
          <h2>9. {t('terms.liability')}</h2>
          <p>
            {t('terms.liabilityText')}
          </p>
        </div>
        
        <div className="page-section animate-slideInUp">
          <h2>10. {t('terms.changes')}</h2>
          <p>
            {t('terms.changesText')}
          </p>
        </div>
        
        <div className="page-contact animate-slideInUp">
          <h2>11. {t('terms.contact')}</h2>
          <p>
            {t('terms.contactText')}
          </p>
          <p>Email: <a href="mailto:legal@movieapp.com">legal@movieapp.com</a></p>
          <p>
            {t('footer.contactInfo.company')}<br />
            {t('footer.contactInfo.address')}<br />
            {t('footer.contactInfo.phone')}
          </p>
        </div>
        
        <p className="last-updated">{t('privacy.lastUpdated')}</p>
      </div>
    </main>
  );
};

export default Terms; 