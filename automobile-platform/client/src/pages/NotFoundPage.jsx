import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="panel centered-panel">
          <h1>404</h1>
          <p>Тази страница не съществува.</p>
          <Link className="button" to="/">
            Обратно към началото
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
