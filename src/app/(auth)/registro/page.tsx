'use client';
import { Form, Input, Button, Select, message, Modal, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth.service';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';

registerLocale('es', es);

export default function PaginaRegistro() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [telefono, setTelefono] = useState('');
  const [codigoTelefono, setCodigoTelefono] = useState('503');
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);

  useEffect(() => {
    const guardado = localStorage.getItem('registro_borrador');
    if (guardado) {
      const datos = JSON.parse(guardado);
      form.setFieldsValue(datos);
      if (datos.fechaNacimiento) {
        setFechaNacimiento(new Date(datos.fechaNacimiento));
      }
    }
  }, []);

  const alCambiar = () => {
    const valores = form.getFieldsValue();
    localStorage.setItem('registro_borrador', JSON.stringify(valores));
  };

  const alEnviar = async (valores: any) => {
    if (!fechaNacimiento) {
      form.setFields([{ name: 'fechaNacimiento', errors: ['Requerido'] }]);
      return;
    }
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
        fechaNacimiento: fechaNacimiento?.toISOString().split('T')[0],
        correo: valores.correo,
        telefono: valores.telefono,
        codigoTelefono: valores.codigoTelefono || '503',
        contrasena: valores.contrasena,
      });
      localStorage.removeItem('registro_borrador');
      message.success('Cuenta creada exitosamente');
      router.push('/ordenes');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setModalVisible(false);
    }
  };

  const calcularEdad = (fechaNac: Date) => {
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    return mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate()) ? edad - 1 : edad;
  };

  const fechaMaxima = () => {
    const fecha = new Date();
    fecha.setFullYear(fecha.getFullYear() - 18);
    return fecha;
  };

  const features = [
    {
      titulo: 'Envíos same-day & next-day',
      desc: 'Misma área metropolitana al instante. Nacional en 24 horas.',
      icono: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L4.5 12.5h6L11 22l8.5-10.5h-6L13 2z" fill="white" />
        </svg>
      ),
    },
    {
      titulo: 'Sin contratos largos',
      desc: 'Empieza cuando quieras. Pausa cuando necesites. Sin letra pequeña.',
      icono: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      titulo: 'Cobertura en LatAm',
      desc: 'El Salvador, Guatemala, Honduras, Costa Rica y Nicaragua.',
      icono: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
          <path d="M3 12h18M12 3a14 14 0 0 1 4 9 14 14 0 0 1-4 9 14 14 0 0 1-4-9 14 14 0 0 1 4-9z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;500;600;700;800;900&display=swap');

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

        .registro-page .ant-space-compact {
          display: flex !important;
          width: 100% !important;
        }

        .registro-page .ant-space-compact .ant-select .ant-select-selector {
          border-radius: 8px 0 0 8px !important;
          height: 40px !important;
          background: #f5f5f5 !important;
        }

        .registro-page .ant-space-compact .ant-input {
          border-radius: 0 8px 8px 0 !important;
          height: 40px !important;
        }

        .fecha-picker-wrapper {
          width: 100%;
        }

        .fecha-picker-wrapper .react-datepicker-wrapper {
          width: 100%;
        }

        .fecha-picker-wrapper .react-datepicker__input-container input {
          width: 100%;
          height: 40px;
          border: 1px solid #d9d9d9;
          border-radius: 8px;
          padding: 0 14px;
          font-size: 14px;
          color: #050817;
          outline: none;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
          font-family: 'Mona Sans', sans-serif !important;
        }

        .fecha-picker-wrapper .react-datepicker__input-container input:hover {
          border-color: #b0b0b0;
        }

        .fecha-picker-wrapper .react-datepicker__input-container input:focus {
          border-color: #050817;
          box-shadow: 0 0 0 2px rgba(5, 8, 23, 0.08);
        }

        .react-datepicker {
          font-family: 'Mona Sans', sans-serif !important;
          border: 1px solid #f0f0f0 !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
        }

        .react-datepicker__header {
          background: #fafafa !important;
          border-bottom: 1px solid #f0f0f0 !important;
          border-radius: 12px 12px 0 0 !important;
        }

        .react-datepicker__current-month {
          color: #050817 !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }

        .react-datepicker__day-name {
          color: #6b7280 !important;
          font-weight: 500 !important;
        }

        .react-datepicker__day {
          color: #050817 !important;
          border-radius: 6px !important;
        }

        .react-datepicker__day:hover {
          background: #f0f0f0 !important;
          color: #050817 !important;
        }

        .react-datepicker__day--selected {
          background: #fc4a3e !important;
          color: white !important;
        }

        .react-datepicker__day--keyboard-selected {
          background: #fff0ee !important;
          color: #fc4a3e !important;
        }

        .react-datepicker__day--disabled {
          color: #d9d9d9 !important;
        }

        .react-datepicker__navigation-icon::before {
          border-color: #050817 !important;
        }

        .react-datepicker__year-dropdown,
        .react-datepicker__month-dropdown {
          background: white !important;
          border: 1px solid #f0f0f0 !important;
          border-radius: 8px !important;
        }

        .react-datepicker__year-option:hover,
        .react-datepicker__month-option:hover {
          background: #f0f0f0 !important;
        }

        .react-datepicker__year-read-view--down-arrow,
        .react-datepicker__month-read-view--down-arrow {
          border-color: #050817 !important;
        }
        .react-datepicker-popper {
          z-index: 9999 !important;
        }

        /* Logo de fondo, marca de agua */
        .registro-logo-watermark {
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

        /* Feature card */
        .feature-card {
          transition: all 0.25s ease;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.18) !important;
          border-color: rgba(255,255,255,0.35) !important;
          transform: translateX(4px);
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

            <Form form={form} layout="vertical" onFinish={alEnviar} onValuesChange={alCambiar}>
              <div
                className="registro-grid"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 16, rowGap: 0 }}
              >
                <Form.Item
                  name="nombre"
                  label="Nombre"
                  rules={[
                    { required: true, message: 'Requerido' },
                    { max: 20, message: 'Máximo 20 caracteres' },
                    { pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Solo se permiten letras' }
                  ]}
                >
                  <Input placeholder="Digita tu nombre" style={{ height: 40 }} maxLength={20} />
                </Form.Item>

                <Form.Item
                  name="apellido"
                  label="Apellido"
                  rules={[
                    { required: true, message: 'Requerido' },
                    { max: 20, message: 'Máximo 20 caracteres' },
                    { pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Solo se permiten letras' }
                  ]}
                >
                  <Input placeholder="Digita tu apellido" style={{ height: 40 }} maxLength={20} />
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

                <Form.Item
                  name="fechaNacimiento"
                  label="Fecha de nacimiento"
                  rules={[
                    { required: true, message: 'Requerido' },
                    {
                      validator: (_, value) => {
                        if (!fechaNacimiento) return Promise.reject('Requerido');
                        const edad = calcularEdad(fechaNacimiento);
                        if (edad < 18) return Promise.reject('Debes tener al menos 18 años');
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <div className="fecha-picker-wrapper">
                    <DatePicker
                      selected={fechaNacimiento}
                      onChange={(date) => {
                        setFechaNacimiento(date);
                        form.setFieldValue('fechaNacimiento', date);
                        form.validateFields(['fechaNacimiento']);
                      }}
                      locale="es"
                      dateFormat="dd/MM/yyyy"
                      maxDate={fechaMaxima()}
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      placeholderText="Seleccionar fecha"
                      yearDropdownItemNumber={100}
                      scrollableYearDropdown
                    />
                  </div>
                </Form.Item>

                <Form.Item
                  name="correo"
                  label="Correo electrónico"
                  rules={[{ required: true, type: 'email', message: 'Correo inválido' }]}
                >
                  <Input placeholder="Digitar correo" style={{ height: 40 }} />
                </Form.Item>

                <Form.Item label="Número de WhatsApp">
                  <Space.Compact style={{ display: 'flex', width: '100%' }}>
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
                      rules={[
                        { required: true, message: 'Requerido' },
                        { len: 8, message: 'El teléfono debe tener exactamente 8 dígitos' },
                        { pattern: /^[0-9]+$/, message: 'Solo se permiten números' }
                      ]}
                    >
                      <Input
                        style={{ flex: 1, height: 40 }}
                        placeholder="7777 7777"
                        maxLength={8}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== 'Backspace' &&
                            e.key !== 'Delete' &&
                            e.key !== 'Tab' &&
                            e.key !== 'ArrowLeft' &&
                            e.key !== 'ArrowRight'
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>

                <Form.Item
                  name="contrasena"
                  label="Contraseña"
                  rules={[
                    { required: true, message: 'Requerido' },
                    { min: 6, message: 'Mínimo 6 caracteres' },
                    { max: 30, message: 'Máximo 30 caracteres' }
                  ]}
                >
                  <Input.Password style={{ height: 40 }} placeholder="Digitar contraseña" maxLength={30} />
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
                  <Input.Password style={{ height: 40 }} placeholder="Digitar contraseña" maxLength={30} />
                </Form.Item>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{
                  background: '#fc4a3e',
                  borderColor: '#fc4a3e',
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

        {/* Panel derecho — naranja Boxful con feature cards */}
        <div
          className="registro-panel-derecho"
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
          {/* Marca de agua */}
          <img src="/login.png" alt="" className="registro-logo-watermark" />

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

          {/* Centro: hero + feature cards */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 36 }}>
            {/* Hero */}
            <h2
              style={{
                color: 'white',
                fontSize: 'clamp(28px, 3vw, 42px)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                margin: 0,
                maxWidth: 500,
              }}
            >
              Todo lo que tu negocio necesita para enviar{' '}
              <span style={{ color: '#0a0a0a', textShadow: '4px 4px 0 rgba(255,255,255,0.25)' }}>rápido</span>
            </h2>

            {/* Feature cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {features.map((f, i) => (
                <div
                  key={i}
                  className="feature-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 12,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {f.icono}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
                      {f.titulo}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie sutil */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Boxful · Envíos ultra-rápidos para LatAm
          </div>
        </div>

        <Modal
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={confirmarRegistro}
          okText="Aceptar"
          cancelText="Cancelar"
          okButtonProps={{ style: { background: '#fc4a3e', borderColor: '#fc4a3e' } }}
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