import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useCreateProject } from '@/hooks/useProjects';
import { PROJECT_STATUS_LABELS, PROJECT_STATUSES } from '@/utils/constants';

/**
 * Modal for creating a new project. Wraps the existing reusable <Modal>,
 * <Input>, and <Button> components rather than reinventing them.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 */
const CreateProjectModal = ({ isOpen, onClose }) => {
  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
      deadline: '',
      status: PROJECT_STATUSES.PLANNING,
    },
  });

  // Reset the form each time the modal is freshly opened so stale values
  // (or validation errors) from a previous open don't linger.
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name.trim(),
      description: data.description.trim(),
      status: data.status,
      // Omit deadline entirely if left blank, rather than sending an empty string.
      ...(data.deadline ? { deadline: new Date(data.deadline).toISOString() } : {}),
    };

    try {
      await createProject.mutateAsync(payload);
      onClose();
    } catch {
      // Error toast is already handled inside useCreateProject; swallow
      // here so the modal stays open for the user to fix and retry.
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Project Name"
          placeholder="e.g. Website Redesign"
          error={errors.name?.message}
          {...register('name', {
            required: 'Project name is required.',
            minLength: { value: 2, message: 'Name must be at least 2 characters.' },
            maxLength: { value: 100, message: 'Name must be under 100 characters.' },
          })}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="What is this project about?"
            aria-invalid={!!errors.description}
            className={`focus-ring w-full resize-none rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:text-slate-100 ${
              errors.description
                ? 'border-red-400'
                : 'border-slate-300 dark:border-slate-700'
            }`}
            {...register('description', {
              maxLength: { value: 1000, message: 'Description must be under 1000 characters.' },
            })}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Deadline"
            type="date"
            error={errors.deadline?.message}
            {...register('deadline', {
              validate: (value) =>
                !value || new Date(value).getTime() > Date.now() || 'Deadline must be in the future.',
            })}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="status"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Status
            </label>
            <select
              id="status"
              className="focus-ring w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              {...register('status')}
            >
              {Object.values(PROJECT_STATUSES).map((value) => (
                <option key={value} value={value}>
                  {PROJECT_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createProject.isPending}>
            {createProject.isPending ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
