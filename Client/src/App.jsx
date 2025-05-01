import { RouterProvider } from 'react-router-dom';
import router from "./routes.jsx";
import './App.css';
import { SessionProvider } from './context/SessionContext.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 via-slate-800 to-slate-900">
      <div className="flex justify-center items-center min-h-screen">
        <SessionProvider>
        <RouterProvider router={router} />
        </SessionProvider>
      </div>
    </div>
  );
}

export default App;
