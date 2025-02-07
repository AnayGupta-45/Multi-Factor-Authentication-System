import { RouterProvider } from 'react-router-dom';
import router from './routes'; // ✅ Correct import
import './App.css';

function App() {
  return (
    <div className="bg-slate-100 h-screen">
      <div className="flex justify-center items-center h-screen">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
