import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <footer>
        <div className="footer">
          <div className="footer-text">
            <h1 className="footer-movieapp">MOVIEAPP</h1>
          </div>
          <div className="footer-center">
            <div className="footer-center-text">
              <span className="center-text">
                {t('footer.moto')}
              </span>
            </div>
          </div>
          <div className="footer-info-right">
            <Link className="footer-pages" to="/faq">
              {t('footer.faq')}
            </Link>
            <div className="contact-wrapper">
              <a className="contact-link" href="#">
                {t('footer.contact')}
              </a>
              <div className="contact-popup">
                {t('footer.contactInfo.company')}
                <br />
                {t('footer.contactInfo.address')}
                <br />
                {t('footer.contactInfo.phone')}
                <br />
                {t('footer.contactInfo.email')}
              </div>
            </div>
            <Link className="footer-pages" to="/privacy">
              {t('footer.privacy')}
            </Link>
            <Link className="footer-pages" to="/terms">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          {t('footer.copyright')}
        </div>
      </footer>
    </>
  );
};

export default Footer;
