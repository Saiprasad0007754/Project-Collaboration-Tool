/**
 * Generic empty-state placeholder for lists, boards, and search results
 * with nothing to show yet.
 */
const EmptyState = ({ title = 'Nothing here yet', description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
      {icon && <div className="mb-2 text-3xl text-slate-400">{icon}</div>}
      <h3 className="text-base font-medium text-slate-700 dark:text-slate-200">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-slate-400 dark:text-slate-500">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
};

export default EmptyState;
