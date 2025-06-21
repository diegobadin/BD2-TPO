import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: 16, borderRight: '1px solid #eee' }}>
      <h3>Consultas</h3>
      <ul>
        <li><NavLink to="/q1">1. Proveedores Act+Habil</NavLink></li>
        <li><NavLink to="/q2">2. Teléfonos “Tecnología”</NavLink></li>
        <li><NavLink to="/q3">3. teléfono junto con datos del proveedor”</NavLink></li>
        <li><NavLink to="/q4">4. proveedores con al menos una orden”</NavLink></li>
        <li><NavLink to="/q5">5. proveedores que NO tengan registrada ninguna orden”</NavLink></li>
        <li><NavLink to="/q6">6. proveedores, + info ordenes”</NavLink></li>
        <li><NavLink to="/q7">7. pedidos a 30-66060817-5”</NavLink></li>
        <li><NavLink to="/q8">8. productos que han sido pedido al menos 1 vez.”</NavLink></li>
        <li><NavLink to="/q9">9. marca “COTO”.”</NavLink></li>
        <li><NavLink to="/q10">10. órdenes de pedido ordenadas por fecha”</NavLink></li>
        <li><NavLink to="/q11">11. productos que aún NO han sido pedidos”</NavLink></li>
        <li><NavLink to="/q12">12. proveedores activos que están inhabilitados.”</NavLink></li>
      </ul>
    </nav>
  );
}