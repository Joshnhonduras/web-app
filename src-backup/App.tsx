import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Hub from './modules/hub/Hub';
import MasculineMentor from './modules/masculine-mentor/MasculineMentor';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/masculine-mentor/*" element={<MasculineMentor />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
