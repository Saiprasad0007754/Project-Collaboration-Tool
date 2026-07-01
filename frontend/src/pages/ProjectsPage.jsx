import { useState } from 'react';
import { FiPlus, FiFolder } from 'react-icons/fi';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import EmptyState from '@/components/common/EmptyState';
import ProjectCard from '@/components/project/ProjectCard';
import CreateProjectModal from '@/components/project/CreateProjectModal';
import { useProjects } from '@/hooks/useProjects';

/**
 * Projects page: lists every project the authenticated user created or
 * belongs to, and lets them create a new one via CreateProjectModal.
 */
const ProjectsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data, isLoading, isError, error } = useProjects();

  const projects = data?.data?.projects || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            All projects you&apos;re a member of, in one place.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <FiPlus size={16} />
          New Project
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/10">
          Could not load projects: {error?.message}
        </div>
      )}

      {!isLoading && !isError && projects.length === 0 && (
        <EmptyState
          icon={<FiFolder />}
          title="No projects yet"
          description="Create your first project to start organizing tasks and collaborating with your team."
          action={<Button onClick={() => setIsCreateModalOpen(true)}>Create a Project</Button>}
        />
      )}

      {!isLoading && !isError && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default ProjectsPage;
