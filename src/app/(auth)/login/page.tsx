'use client';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';

export default function PaginaLogin() {
  const router = useRouter();

  const alEnviar = async (valores: any) => {
    try {
      await AuthService.iniciarSesion(valores.correo, valores.contrasena);
      message.success('Sesión iniciada correctamente');
      router.push('/ordenes');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Credenciales inválidas');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;500;600;700;800;900&display=swap');

        .login-page * {
          font-family: 'Mona Sans', sans-serif !important;
          box-sizing: border-box !important;
        }

        .login-page .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #050817 !important;
          font-size: 12px !important;
        }

        .login-page .ant-form-item-label > label.ant-form-item-required::before,
        .login-page .ant-form-item-label > label.ant-form-item-required::after {
          display: none !important;
        }

        .login-page .ant-form-item {
          margin-bottom: 16px !important;
        }

        .login-page .ant-input,
        .login-page .ant-input-affix-wrapper {
          height: 40px !important;
          min-height: 40px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          display: flex !important;
          align-items: center !important;
          background: white !important;
        }

        .login-page .ant-input-affix-wrapper {
          padding: 0 11px !important;
        }

        .login-page .ant-input-affix-wrapper input {
          height: 38px !important;
          line-height: 38px !important;
          background: white !important;
        }

        .login-page .anticon svg {
          width: 15px !important;
          height: 15px !important;
          stroke: #050817 !important;
          stroke-width: 55 !important;
          fill: #050817 !important;
        }

        /* Logo de fondo, marca de agua */
        .logo-watermark {
          position: absolute;
          right: -80px;
          bottom: -100px;
          width: 600px;
          height: auto;
          opacity: 0.08;
          filter: brightness(0) invert(1);
          pointer-events: none;
          z-index: 0;
        }

        @media (max-width: 768px) {
          .login-panel-derecho {
            display: none !important;
          }
          .login-panel-izquierdo {
            padding: 32px 24px !important;
          }
        }
      `}</style>

      <div className="login-page" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* Panel izquierdo — formulario */}
        <div
          className="login-panel-izquierdo"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '0 80px',
            background: '#fafafa',
            height: '100vh',
          }}
        >
          <div style={{ width: '100%', maxWidth: 820 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#050817', margin: '0 0 6px' }}>
              Bienvenido
            </h1>
            <p style={{ color: '#6b7280', marginBottom: 28, fontSize: 13 }}>
              Por favor ingresa tus credenciales
            </p>

            <Form layout="vertical" onFinish={alEnviar}>
              <Form.Item
                name="correo"
                label="Correo electrónico"
                rules={[{ required: true, type: 'email', message: 'Correo inválido' }]}
              >
                <Input placeholder="Digita tu correo" style={{ height: 40 }} />
              </Form.Item>

              <Form.Item
                name="contrasena"
                label="Contraseña"
                rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
              >
                <Input.Password placeholder="Digita tu contraseña" style={{ height: 40 }} />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{
                  background: '#fc4a3e',
                  borderColor: '#fc4a3e',
                  marginTop: 24,
                  height: 44,
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 8,
                }}
              >
                Iniciar sesión
              </Button>
            </Form>

            <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 13 }}>
              ¿Necesitas una cuenta?{' '}
              <a href="/registro" style={{ fontWeight: 700, color: '#050817' }}>
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>

        {/* Panel derecho — brand poster */}
        <div
          className="login-panel-derecho"
          style={{
            flex: 1,
            background: 'linear-gradient(160deg, #ff6b5e 0%, #fc4a3e 60%, #e63d31 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Marca de agua del logo */}
          <img src="/login.png" alt="" className="logo-watermark" />

          {/* Marca arriba izquierda */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <img
              src="/login.png"
              alt="Boxful"
              style={{
                width: 40,
                height: 'auto',
                filter: 'brightness(0) invert(1)',
              }}
            />
            <span
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.02em',
              }}
            >
              boxful
            </span>
          </div>

          {/* Slogan centrado verticalmente */}
          <h2
            style={{
              color: 'white',
              fontSize: 'clamp(32px, 3.6vw, 52px)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: 0,
              maxWidth: 560,
              position: 'relative',
              zIndex: 1,
            }}
          >
            Hacemos que el{' '}
            <span style={{ fontWeight: 900, whiteSpace: 'nowrap', color: '#111', textShadow: '4px 4px 0 rgba(255,255,255,0.3)' }}>e-commerce</span>{' '}
            sea fácil y accesible para todos
          </h2>

          {/* Pie con stats inline — centrados */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 40,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-0.02em' }}>
                100<span style={{ fontSize: 22 }}>%</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 6 }}>
                Efectividad<br />en envíos
              </div>
            </div>

            <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,0.25)' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-0.02em' }}>
                24<span style={{ fontSize: 22 }}>h</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 6 }}>
                Entrega<br />nacional
              </div>
            </div>

            <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,0.25)' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-0.02em' }}>
                LatAm
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 6 }}>
                Cobertura<br />regional
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}