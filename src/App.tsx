import './App.css';
import Header from '@/components/layout/Header.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import MainStats from '@/views/MainStats.tsx';
import { Toaster } from '@/components/ui/toaster.tsx';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <MainStats />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
