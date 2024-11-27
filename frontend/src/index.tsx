import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';

const isDevelopment = process.env.NODE_ENV === 'development';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>,
);
