import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '@/api';
import Spinner from '@/components/common/Spinner';
import EmptyState from '@/components/common/EmptyState';
import Badge from '@/components/common/Badge';
import { FiFolder } from 'react-icons/fi';

/**
 * Projects page placeholder. Demonstrates the intended React Query data
 * pattern by hitting the backend's /health endpoint as a connectivity
 * smoke test — replace with a real `useProjects()` query once the
 * Project model/controller/route exist.
 */
const ProjectsPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['health-check'],
    queryFn: checkHealth,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            All projects you're a member of will appear here.
          </p>
        </div>
        {!isLoading && !isError && (
          <Badge color={data?.data?.database === 'connected' ? 'green' : 'yellow'}>
            API: {data?.data?.database === 'connected' ? 'Connected' : 'Checking...'}
          </Badge>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/10">
          Could not reach the API: {error?.message}
        </div>
      )}

      {!isLoading && !isError && (
        <EmptyState
          icon={<FiFolder />}
          title="No projects yet"
          description="Project creation will be available once the Project resource is implemented in an upcoming phase."
        />
      )}
    </div>
  );
};

export default ProjectsPage;
