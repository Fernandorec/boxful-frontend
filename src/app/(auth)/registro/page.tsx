'use client';
import { Form, Input, Button, Select, DatePicker, message, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthService } from '@/services/auth.service';

export default function PaginaRegistro() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [telefono, setTelefono] = useState('');
  const [codigoTelefono, setCodigoTelefono] = useState('503');

  const alEnviar = async (valores: any) => {
    setTelefono(valores.telefono);
    setCodigoTelefono(valores.codigoTelefono || '503');
    setModalVisible(true);
  };

  const confirmarRegistro = async () => {
    try {
      const valores = form.getFieldsValue();
      await AuthService.registrar({
        nombre: valores.nombre,
        apellido: valores.apellido,
        sexo: valores.sexo,
        fechaNacimiento: valores.fechaNacimiento?.format('YYYY-MM-DD'),
        correo: valores.correo,
        telefono: valores.telefono,
        codigoTelefono: valores.codigoTelefono || '503',
        contrasena: valores.contrasena,
      });
      message.success('Cuenta creada exitosamente');
      router.push('/ordenes');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;500;600;700&display=swap');

        .registro-page * {
          font-family: 'Mona Sans', sans-serif !important;
          box-sizing: border-box !important;
        }

        .registro-page .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #050817 !important;
          font-size: 12px !important;
        }

        .registro-page .ant-form-item-label > label.ant-form-item-required::before,
        .registro-page .ant-form-item-label > label.ant-form-item-required::after {
          display: none !important;
        }

        .registro-page .ant-form-item {
          margin-bottom: 20px !important;
        }

        .registro-page .ant-input,
        .registro-page .ant-input-affix-wrapper,
        .registro-page .ant-picker,
        .registro-page .ant-select-selector {
          height: 40px !important;
          min-height: 40px !important;
          max-height: 40px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          display: flex !important;
          align-items: center !important;
        }

        .registro-page .ant-input-affix-wrapper {
          padding: 0 11px !important;
        }

        .registro-page .ant-input-affix-wrapper input {
          height: 38px !important;
          line-height: 38px !important;
        }

        .registro-page .ant-select-selector {
          align-items: center !important;
          display: flex !important;
        }

        .registro-page .anticon svg {
          width: 15px !important;
          height: 15px !important;
          stroke: #050817 !important;
          stroke-width: 55 !important;
          fill: #050817 !important;
        }

        .registro-page .ant-input-group-compact {
          display: flex !important;
          height: 40px !important;
        }

        .registro-page .ant-input-group-compact .ant-select .ant-select-selector {
          border-radius: 8px 0 0 8px !important;
          height: 40px !important;
          background: #f5f5f5 !important;
        }

        .registro-page .ant-input-group-compact .ant-input {
          border-radius: 0 8px 8px 0 !important;
          height: 40px !important;
        }

        @media (max-width: 768px) {
          .registro-grid {
            grid-template-columns: 1fr !important;
          }
          .registro-panel-derecho {
            display: none !important;
          }
          .registro-panel-izquierdo {
            padding: 32px 24px !important;
          }
        }
      `}</style>

      <div className="registro-page" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        <div
          className="registro-panel-izquierdo"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '48px 64px',
            background: '#fafafa',
            overflowY: 'auto',
            height: '100vh',
          }}
        >
          <div style={{ width: '100%', maxWidth: 520 }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <a href="/login" style={{ color: '#050817', fontSize: 24, lineHeight: 1, textDecoration: 'none' }}>‹</a>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: '#050817', margin: 0 }}>
                Cuéntanos de ti
              </h1>
            </div>
            <p style={{ color: '#6b7280', marginBottom: 28, fontSize: 14 }}>
              Completa la información de registro
            </p>

            <Form form={form} layout="vertical" onFinish={alEnviar}>
              <div
                className="registro-grid"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 16, rowGap: 0 }}
              >
                <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Requerido' }]}>
                  <Input placeholder="Digita tu nombre" style={{ height: 40 }} />
                </Form.Item>

                <Form.Item name="apellido" label="Apellido" rules={[{ required: true, message: 'Requerido' }]}>
                  <Input placeholder="Digita tu apellido" style={{ height: 40 }} />
                </Form.Item>

                <Form.Item name="sexo" label="Sexo">
                  <Select
                    placeholder="Seleccionar"
                    style={{ width: '100%', height: 40 }}
                    suffixIcon={<span style={{ fontWeight: 900, color: '#050817', fontSize: 14 }}>▾</span>}
                  >
                    <Select.Option value="masculino">Masculino</Select.Option>
                    <Select.Option value="femenino">Femenino</Select.Option>
                    <Select.Option value="otro">Otro</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="fechaNacimiento" label="Fecha de nacimiento">
                  <DatePicker style={{ width: '100%', height: 40 }} placeholder="Seleccionar" />
                </Form.Item>

                <Form.Item
                  name="correo"
                  label="Correo electrónico"
                  rules={[{ required: true, type: 'email', message: 'Correo inválido' }]}
                >
                  <Input placeholder="Digitar correo" style={{ height: 40 }} />
                </Form.Item>

                <Form.Item label="Número de WhatsApp">
                  <Input.Group compact style={{ display: 'flex', height: 40 }}>
                    <Form.Item name="codigoTelefono" noStyle initialValue="503">
                      <Select
                        style={{ width: 85, height: 40 }}
                        suffixIcon={<span style={{ fontWeight: 900, color: '#050817', fontSize: 14 }}>▾</span>}
                      >
                        <Select.Option value="503">503</Select.Option>
                        <Select.Option value="502">502</Select.Option>
                        <Select.Option value="504">504</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="telefono"
                      noStyle
                      rules={[{ required: true, message: 'Requerido' }]}
                    >
                      <Input
                        style={{ flex: 1, height: 40, borderRadius: '0 8px 8px 0' }}
                        placeholder="7777 7777"
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>

                <Form.Item
                  name="contrasena"
                  label="Contraseña"
                  rules={[{ required: true, min: 6, message: 'Mínimo 6 caracteres' }]}
                >
                  <Input.Password style={{ height: 40 }} placeholder="Digitar contraseña" />
                </Form.Item>

                <Form.Item
                  name="repetirContrasena"
                  label="Repetir contraseña"
                  dependencies={['contrasena']}
                  rules={[
                    { required: true, message: 'Requerido' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('contrasena') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Las contraseñas no coinciden');
                      },
                    }),
                  ]}
                >
                  <Input.Password style={{ height: 40 }} placeholder="Digitar contraseña" />
                </Form.Item>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{
                  background: '#3D52D5',
                  borderColor: '#3D52D5',
                  marginTop: 8,
                  height: 44,
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 8,
                }}
              >
                Siguiente
              </Button>
            </Form>

            <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 14 }}>
              ¿Ya tienes cuenta?{' '}
              <a href="/login" style={{ fontWeight: 700, color: '#050817' }}>
                Inicia sesión
              </a>
            </p>
          </div>
        </div>

        <div className="registro-panel-derecho" style={{ flex: 1, background: '#f0f0f0' }} />

        <Modal
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={confirmarRegistro}
          okText="Aceptar"
          cancelText="Cancelar"
          okButtonProps={{ style: { background: '#3D52D5', borderColor: '#3D52D5' } }}
          title={null}
          centered
        >
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontSize: 18, color: '#050817', fontWeight: 700 }}>
              Confirmar número <strong>de teléfono</strong>
            </h3>
            <p style={{ color: '#6b7280' }}>
              ¿Está seguro de que desea continuar con el número{' '}
              <strong>+{codigoTelefono} {telefono}?</strong>
            </p>
          </div>
        </Modal>
      </div>
    </>
  );
}