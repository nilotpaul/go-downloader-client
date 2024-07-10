import { cn } from '@/lib/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './ThemeProvider';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';

const queryClient = new QueryClient({});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
]);

const Providers = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        closeButton
        cn={cn}
        expand
        duration={2500}
        position='bottom-right'
        richColors
        theme='system'
      />
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
