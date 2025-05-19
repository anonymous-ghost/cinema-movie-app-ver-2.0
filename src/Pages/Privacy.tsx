import "../styles/Page.css";
import "../styles/animations.css";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation();
  
  return (
    <main>
      <div className="page-container">
        <h1 className="page-title animate-glow">{t('privacy.title')}</h1>
        
        <div className="page-section animate-slideInUp delay-100">
          <h2>1. {t('privacy.introduction')}</h2>
          <p>
            {t('privacy.introText1')}
          </p>
          <p>
            {t('privacy.introText2')}
          </p>
        </div>
        
        <div className="page-section animate-slideInUp delay-200">
          <h2>2. {t('privacy.infoCollect')}</h2>
          <p>{t('privacy.infoCollectText')}</p>
          <ul>
            <li>
              <strong>{t('privacy.personalInfo')}</strong> {t('privacy.personalInfoText')}
            </li>
            <li>
              <strong>{t('privacy.usageInfo')}</strong> {t('privacy.usageInfoText')}
            </li>
            <li>
              <strong>{t('privacy.deviceInfo')}</strong> {t('privacy.deviceInfoText')}
            </li>
            <li>
              <strong>{t('privacy.locationInfo')}</strong> {t('privacy.locationInfoText')}
            </li>
          </ul>
        </div>
        
        <div className="page-section animate-slideInUp delay-300">
          <h2>3. {t('privacy.infoUse')}</h2>
          <p>{t('privacy.infoUseText')}</p>
          <ul>
            <li>{t('common.bookTickets')}</li>
            <li>{t('payment.processing')}</li>
            <li>{t('profile.editProfile')}</li>
            <li>{t('favorites.addToFavorites')}</li>
            <li>{t('home.search')}</li>
            <li>{t('booking.bookingDetails')}</li>
            <li>{t('auth.login')}</li>
          </ul>
        </div>
        
        <div className="page-section animate-slideInUp delay-400">
          <h2>4. {t('privacy.infoShare')}</h2>
          <p>{t('privacy.infoShareText')}</p>
          <ul>
            <li>
              <strong>{t('privacy.serviceProviders')}</strong> {t('privacy.serviceProvidersText')}
            </li>
            <li>
              <strong>{t('privacy.businessPartners')}</strong> {t('privacy.businessPartnersText')}
            </li>
            <li>
              <strong>{t('privacy.legalRequirements')}</strong> {t('privacy.legalRequirementsText')}
            </li>
            <li>
              <strong>{t('privacy.businessTransfers')}</strong> {t('privacy.businessTransfersText')}
            </li>
          </ul>
          <p>
            {t('privacy.noSelling')}
          </p>
        </div>
        
        <div className="page-section animate-slideInUp delay-500">
          <h2>5. {t('privacy.dataSecurity')}</h2>
          <p>
            {t('privacy.dataSecurityText')}
          </p>
        </div>
        
        <div className="page-section animate-slideInUp">
          <h2>6. {t('privacy.yourRights')}</h2>
          <p>{t('privacy.yourRightsText')}</p>
          <ul>
            <li>{t('profile.editProfile')}</li>
            <li>{t('profile.updatePassword')}</li>
            <li>{t('common.cancel')}</li>
            <li>{t('privacy.dataSecurityText')}</li>
            <li>{t('auth.authRequired')}</li>
          </ul>
          <p>
            {t('privacy.contactText')} privacy@movieapp.com
          </p>
        </div>
        
        <div className="page-section animate-slideInUp">
          <h2>7. {t('privacy.policyChanges')}</h2>
          <p>
            {t('privacy.policyChangesText')}
          </p>
        </div>
        
        <div className="page-contact animate-slideInUp">
          <h2>{t('privacy.contactUs')}</h2>
          <p>
            {t('privacy.contactText')}
          </p>
          <p>Email: <a href="mailto:privacy@movieapp.com">privacy@movieapp.com</a></p>
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

export default Privacy; 