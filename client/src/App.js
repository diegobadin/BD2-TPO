import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Query1 from './pages/Query1';
import Query2 from './pages/Query2';
import Query3 from './pages/Query1';
import Query4 from './pages/Query1';
import Query5 from './pages/Query1';
import Query6 from './pages/Query1';
import Query7 from './pages/Query1';
import Query8 from './pages/Query1';
import Query9 from './pages/Query1';
import Query10 from './pages/Query1';
import Query11 from './pages/Query1';
import Query12 from './pages/Query1';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/q1" element={<Query1 />} />
            <Route path="/q2" element={<Query2 />} />
            <Route path="/q3" element={<Query3 />} />
            <Route path="/q4" element={<Query4 />} />
            <Route path="/q5" element={<Query5 />} />
            <Route path="/q6" element={<Query6 />} />
            <Route path="/q7" element={<Query7 />} />
            <Route path="/q8" element={<Query8 />} />
            <Route path="/q9" element={<Query9 />} />
            <Route path="/q10" element={<Query10 />} />
            <Route path="/q11" element={<Query11 />} />
            <Route path="/q12" element={<Query12 />} />
            {/*<Route path="/new-proveedor" element={<NewProveedor />} />*/}
            {/* /new-producto, /new-orden */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}