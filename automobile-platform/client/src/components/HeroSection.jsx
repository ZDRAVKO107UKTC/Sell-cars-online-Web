import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">AutoBG marketplace</span>
          <h1>Намери точната обява по-бързо.</h1>
          <p>
            AutoBG събира автомобилни обяви с ясна цена, подредени технически данни и
            директен контакт със собственика.
          </p>

          <div className="hero-highlights">
            <div className="hero-highlight">
              <strong>Филтрирай бързо</strong>
              <span>Марка, модел, цена, година и пробег на едно място.</span>
            </div>
            <div className="hero-highlight">
              <strong>Сравнявай по-лесно</strong>
              <span>Подредени спецификации, снимки и ключови детайли за всяка обява.</span>
            </div>
            <div className="hero-highlight">
              <strong>Публикувай уверено</strong>
              <span>Собствен профил, качване на снимки и управление на обявите.</span>
            </div>
          </div>

          <div className="hero-actions">
            <Link className="button" to="/listings">
              Разгледай обяви
            </Link>
            <Link className="button button--ghost" to="/create-listing">
              Публикувай автомобил
            </Link>
          </div>

          <div className="hero-summary">
            <div className="hero-summary__item">
              <strong>Реални данни</strong>
              <span>Обявите и моделите идват от PostgreSQL, не от mock компоненти.</span>
            </div>
            <div className="hero-summary__item">
              <strong>Ясна структура</strong>
              <span>Цена, пробег, гориво, кутия и телефон се виждат веднага.</span>
            </div>
            <div className="hero-summary__item">
              <strong>Контрол от профила</strong>
              <span>Редакция, снимки и коментари за всяка твоя обява.</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <article className="inventory-card">
            <div className="inventory-card__top">
              <div>
                <span className="inventory-card__eyebrow">Акцент от пазара</span>
                <h2>BMW 3 Series G20</h2>
                <p className="inventory-card__subtitle">320d M Sport • сервизна история • София</p>
              </div>
              <div className="inventory-card__price">42 900 лв.</div>
            </div>

            <div className="inventory-card__visual">
              <div className="inventory-card__visual-badge">Проверена информация</div>
              <div className="inventory-card__visual-surface" />
              <div className="inventory-card__visual-silhouette">
                <span className="inventory-card__wheel inventory-card__wheel--left" />
                <span className="inventory-card__wheel inventory-card__wheel--right" />
              </div>
            </div>

            <div className="inventory-card__specs">
              <div>
                <strong>Година</strong>
                <span>2019</span>
              </div>
              <div>
                <strong>Двигател</strong>
                <span>2.0 320d</span>
              </div>
              <div>
                <strong>Мощност</strong>
                <span>190 hp</span>
              </div>
              <div>
                <strong>Кутия</strong>
                <span>Automatic</span>
              </div>
              <div>
                <strong>Гориво</strong>
                <span>Diesel</span>
              </div>
              <div>
                <strong>Задвижване</strong>
                <span>RWD</span>
              </div>
            </div>

            <div className="inventory-card__footer">
              <div className="inventory-card__meta">
                <span>118 000 км</span>
                <span>Automatic</span>
                <span>Diesel</span>
              </div>
              <Link className="text-link" to="/listings">
                Към всички обяви
              </Link>
            </div>
          </article>

          <div className="hero-panel-note">
            <strong>По-ясно представяне на обявите</strong>
            <span>Фокус върху цената, ключовите параметри и бързия преход към детайлите.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
