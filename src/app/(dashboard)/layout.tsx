'use client';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { Dropdown } from 'antd';
import { useState } from 'react';

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const usuario = AuthService.obtenerUsuario();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const menuItems = [
    {
      key: 'cerrar',
      label: 'Cerrar sesión',
      danger: true,
      onClick: () => AuthService.cerrarSesion(),
    },
  ];

  return (
    <>
      <style>{`
        .dashboard-sidebar {
          width: 220px;
          background: white;
          border-right: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          transition: transform 0.3s;
        }
        .dashboard-main {
          margin-left: 220px;
          flex: 1;
          overflow-y: auto;
          background: #fafafa;
          min-height: 100vh;
        }
        .hamburger {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 22px;
          color: #050817;
        }
        .sidebar-overlay {
          display: none;
        }
        @media (max-width: 768px) {
          .dashboard-sidebar {
            transform: translateX(-100%);
          }
          .dashboard-sidebar.abierto {
            transform: translateX(0);
          }
          .dashboard-main {
            margin-left: 0;
          }
          .hamburger {
            display: block;
          }
          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.3);
            z-index: 99;
          }
        }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* Overlay móvil */}
        {menuAbierto && (
          <div className="sidebar-overlay" onClick={() => setMenuAbierto(false)} />
        )}

        {/* Sidebar */}
        <div className={`dashboard-sidebar ${menuAbierto ? 'abierto' : ''}`}>
          <div style={{ marginBottom: 32, paddingLeft: 8 }}>
            <img src="/logo.png" alt="Boxful" style={{ width: 120, height: 'auto' }} />
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, color: '#050817', letterSpacing: '0.08em', paddingLeft: 8, marginBottom: 20 }}>
            MENÚ
          </p>

          <button
            onClick={() => { router.push('/ordenes/nueva'); setMenuAbierto(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#3D52D5',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 8,
              width: '100%',
            }}
          >
            + Crear orden
          </button>

          <button
            onClick={() => { router.push('/ordenes'); setMenuAbierto(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              color: '#050817',
              border: 'none',
              borderRadius: 8,
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            🔍 Historial
          </button>
        </div>

        {/* Contenido principal */}
        <div className="dashboard-main">

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
            borderBottom: '1px solid #f0f0f0',
            background: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}>
            <button className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>
              ☰
            </button>

            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                marginLeft: 'auto',
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#050817' }}>
                  {usuario?.nombre || 'Usuario'}
                </span>
                <span style={{ color: '#9ca3af', fontSize: 12 }}>▾</span>
              </div>
            </Dropdown>
          </div>

          {/* Página */}
          <div style={{ padding: '32px' }}>
            {children}
          </div>

        </div>
      </div>
    </>
  );
}