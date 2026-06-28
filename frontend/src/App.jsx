import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';

import { queryClient } from '@/api/queryClient';
import { router } from '@/routes';
import ErrorBoundary from '@/components/common/ErrorBoundary';

/**
 * Root component. Provider order (outer to inner):
 * ErrorBoundary -> QueryClientProvider -> DndProvider -> RouterProvider
 *
 * DndProvider wraps the whole router (rather than just the board page)
 * so drag-and-drop works anywhere without re-wrapping subtrees later.
 */
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={HTML5Backend}>
          <RouterProvider router={router} />
          <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        </DndProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
