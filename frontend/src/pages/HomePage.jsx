import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { APP_NAME } from '@/utils/constants';

/**
 * Public landing page. Once authentication is implemented, this should
 * route authenticated users straight to /dashboard.
 */
const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-primary-50 to-white px-6 text-center dark:from-slate-950 dark:to-slate-900">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{APP_NAME}</h1>
      <p className="max-w-md text-slate-500 dark:text-slate-400">
        Plan, track, and ship work together — boards, tasks, and real-time collaboration in one
        place.
      </p>
      <div className="flex gap-3">
        <Link to="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
        <Link to="/projects">
          <Button size="lg" variant="outline">
            View Projects
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
