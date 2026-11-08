import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/routePaths';

const NotFoundPage = () => (
  <section style={{ padding: '100px 24px', textAlign: 'center', color: 'var(--starlight)' }}>
    <h1>Page not found</h1>
    <p>The page you requested does not exist.</p>
    <Link to={PATHS.LANDING}>Return to home</Link>
  </section>
);

export default NotFoundPage;
