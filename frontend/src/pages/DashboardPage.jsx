import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import { FiFolder } from 'react-icons/fi';

/**
 * Dashboard landing page. Currently shows placeholder summary cards —
 * real data wiring (projects, tasks due, activity feed) comes once the
 * corresponding models/routes/services are built.
 */
const DashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back. Here&apos;s an overview of your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Active Projects</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">0</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tasks Due Today</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">0</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Team Members</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">0</p>
        </Card>
      </div>

      <EmptyState
        icon={<FiFolder />}
        title="No projects yet"
        description="Once project creation is implemented, your active projects will show up here."
      />
    </motion.div>
  );
};

export default DashboardPage;
