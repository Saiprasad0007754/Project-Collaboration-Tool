import { FiCalendar, FiUsers } from 'react-icons/fi';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { formatDate } from '@/utils/dateUtils';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/utils/constants';

/**
 * Displays a single project's summary. Purely presentational — no data
 * fetching or mutations here, so it can be reused on the Projects page,
 * a future Dashboard widget, or a project picker.
 *
 * @param {object} project - A Project document from the API.
 * @param {() => void} onClick - Optional click handler (e.g. navigate to detail page).
 */
const ProjectCard = ({ project, onClick }) => {
  const statusLabel = PROJECT_STATUS_LABELS[project.status] || project.status;
  const statusColor = PROJECT_STATUS_COLORS[project.status] || 'gray';

  return (
    <Card
      as={onClick ? 'button' : 'div'}
      onClick={onClick}
      className={`flex h-full flex-col gap-3 text-left transition-shadow hover:shadow-md ${
        onClick ? 'focus-ring w-full cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 text-base font-semibold text-slate-900 dark:text-white">
          {project.name}
        </h3>
        <Badge color={statusColor} className="shrink-0">
          {statusLabel}
        </Badge>
      </div>

      <p className="line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
        {project.description || 'No description provided.'}
      </p>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-800">
        <span className="flex items-center gap-1.5">
          <FiCalendar size={14} />
          {project.deadline ? formatDate(project.deadline) : 'No deadline'}
        </span>
        <span className="flex items-center gap-1.5">
          <FiUsers size={14} />
          {project.members?.length || 0} member{project.members?.length === 1 ? '' : 's'}
        </span>
      </div>
    </Card>
  );
};

export default ProjectCard;
