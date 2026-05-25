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
        @import url('https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;500;600;700&display=swap');

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
                  background: '#3D52D5',
                  borderColor: '#3D52D5',
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

        {/* Panel derecho — vacío */}
        <div
          className="login-panel-derecho"
          style={{ flex: 1, background: '#f0f0f0' }}
        />
      </div>
    </>
  );
}