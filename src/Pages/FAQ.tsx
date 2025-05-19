import { useEffect } from "react";
import "../styles/Page.css";
import "../styles/animations.css";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Додавання обробника кліків для розгортання FAQ відповідей
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    const toggleFaq = (event: Event) => {
      // Отримання батьківського елемента faq-item
      const target = event.currentTarget as HTMLElement;
      const parent = target.parentElement;
      if (parent) {
        parent.classList.toggle('active');
      }
    };

    // Додавання обробника до всіх питань
    faqQuestions.forEach(question => {
      question.addEventListener('click', toggleFaq);
    });

    // Очищення при розмонтуванні
    return () => {
      faqQuestions.forEach(question => {
        question.removeEventListener('click', toggleFaq);
      });
    };
  }, []);

  return (
    <main>
      <div className="page-container">
        <h1 className="page-title animate-glow">{t('faq.title')}</h1>
        
        <div className="page-section animate-slideInUp delay-100">
          <div className="faq-item">
            <div className="faq-question">
              <span>{t('faq.questions.whatIs.question')}</span>
              <div className="faq-question-icon">+</div>
            </div>
            <div className="faq-answer">
              <p>
                {t('faq.questions.whatIs.answer')}
              </p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>{t('faq.questions.createAccount.question')}</span>
              <div className="faq-question-icon">+</div>
            </div>
            <div className="faq-answer">
              <p>
                {t('faq.questions.createAccount.answer')}
              </p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>{t('faq.questions.onMobile.question')}</span>
              <div className="faq-question-icon">+</div>
            </div>
            <div className="faq-answer">
              <p>
                {t('faq.questions.onMobile.answer')}
              </p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>{t('faq.questions.addFavorites.question')}</span>
              <div className="faq-question-icon">+</div>
            </div>
            <div className="faq-answer">
              <p>
                {t('faq.questions.addFavorites.answer')}
              </p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>{t('faq.questions.purchaseTickets.question')}</span>
              <div className="faq-question-icon">+</div>
            </div>
            <div className="faq-answer">
              <p>
                {t('faq.questions.purchaseTickets.answer')}
              </p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>{t('faq.questions.searchMovies.question')}</span>
              <div className="faq-question-icon">+</div>
            </div>
            <div className="faq-answer">
              <p>
                {t('faq.questions.searchMovies.answer')}
              </p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>{t('faq.questions.paymentMethods.question')}</span>
              <div className="faq-question-icon">+</div>
            </div>
            <div className="faq-answer">
              <p>
                {t('faq.questions.paymentMethods.answer')}
              </p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>{t('faq.questions.reportProblem.question')}</span>
              <div className="faq-question-icon">+</div>
            </div>
            <div className="faq-answer">
              <p>
                {t('faq.questions.reportProblem.answer')}
              </p>
            </div>
          </div>
        </div>

        <div className="page-contact animate-slideInUp delay-200">
          <p>{t('faq.cantFind')}</p>
          <p>{t('faq.contactSupport')} <a href="mailto:support@movieapp.com">support@movieapp.com</a></p>
        </div>
        
        <p className="last-updated">{t('faq.lastUpdated')}</p>
      </div>
    </main>
  );
};

export default FAQ; 