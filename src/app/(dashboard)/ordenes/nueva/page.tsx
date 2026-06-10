'use client';
import { Form, Input, Button, DatePicker, Select, Checkbox, message, ConfigProvider, Space } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OrdenesService } from '@/services/ordenes.service';
import locale from 'antd/locale/es_ES';
import dayjs from 'dayjs';

export default function PaginaNuevaOrden() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [datosPaso1, setDatosPaso1] = useState<any>(null);
  const [esCOD, setEsCOD] = useState(false);
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [erroresPaquetes, setErroresPaquetes] = useState<any[]>([{}]);
  const [paquetes, setPaquetes] = useState([
    { contenido: '', pesoLibras: 0, ancho: 0, alto: 0, largo: 0 }
  ]);
  const [form] = Form.useForm();

  useEffect(() => {
  const guardado = localStorage.getItem('orden_borrador');
  if (guardado) {
    const datos = JSON.parse(guardado);
    setDatosPaso1(datos);
    if (datos.esCOD) setEsCOD(true);
    const valores = { ...datos };
    if (valores.fechaProgramada) {
      valores.fechaProgramada = dayjs(valores.fechaProgramada);
    }
    form.setFieldsValue(valores);
  }
}, []);

  useEffect(() => {
    if (datosPaso1) {
      localStorage.setItem('orden_borrador', JSON.stringify(datosPaso1));
    }
  }, [datosPaso1]);

  const alEnviarPaso1 = (valores: any) => {
  const datosAGuardar = {
    ...valores,
    fechaProgramada: valores.fechaProgramada?.format('YYYY-MM-DD'),
  };
  setDatosPaso1(datosAGuardar);
  setEsCOD(valores.esCOD || false);
  setPaso(2);
};

  const limpiarFormulario = () => {
    form.resetFields();
    setDatosPaso1(null);
    setEsCOD(false);
    localStorage.removeItem('orden_borrador');
  };

  const agregarPaquete = () => {
    setPaquetes([...paquetes, { contenido: '', pesoLibras: 0, ancho: 0, alto: 0, largo: 0 }]);
    setErroresPaquetes([...erroresPaquetes, {}]);
  };

  const eliminarPaquete = (index: number) => {
    setPaquetes(paquetes.filter((_, i) => i !== index));
    setErroresPaquetes(erroresPaquetes.filter((_, i) => i !== index));
  };

  const actualizarPaquete = (index: number, campo: string, valor: any) => {
    const nuevos = [...paquetes];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setPaquetes(nuevos);

    const nuevosErrores = [...erroresPaquetes];
    if (!nuevosErrores[index]) nuevosErrores[index] = {};

    const camposNumericos = ['largo', 'alto', 'ancho', 'pesoLibras'];
    if (camposNumericos.includes(campo)) {
      if (valor === null || valor === undefined || valor === '') {
        nuevosErrores[index][campo] = 'Requerido';
      } else if (['largo', 'alto', 'ancho'].includes(campo) && valor < 5) {
      nuevosErrores[index][campo] = 'El mínimo es 5 cm';
      } else if (['largo', 'alto', 'ancho'].includes(campo) && valor > 10000) {
        nuevosErrores[index][campo] = 'El máximo es 10,000 cm';
      } else if (campo === 'pesoLibras' && valor <= 0) {
        nuevosErrores[index][campo] = 'Debe ser mayor a 0';
      } else if (campo === 'pesoLibras' && valor > 10000) {
        nuevosErrores[index][campo] = 'El máximo es 10,000 lbs';
      } else {
        nuevosErrores[index][campo] = '';
      }
    }
    setErroresPaquetes(nuevosErrores);
  };

  const alEnviarPaso2 = async () => {
  setIntentoEnviar(true);

  const nuevosErrores = paquetes.map((p) => {
    const errores: any = {};
    if (!p.largo) errores.largo = 'Requerido';
    else if (p.largo < 5) errores.largo = 'El mínimo es 5 cm';
    else if (p.largo > 10000) errores.largo = 'El máximo es 10,000 cm';

    if (!p.alto) errores.alto = 'Requerido';
    else if (p.alto < 5) errores.alto = 'El mínimo es 5 cm';
    else if (p.alto > 10000) errores.alto = 'El máximo es 10,000 cm';

    if (!p.ancho) errores.ancho = 'Requerido';
    else if (p.ancho < 5) errores.ancho = 'El mínimo es 5 cm';
    else if (p.ancho > 10000) errores.ancho = 'El máximo es 10,000 cm';

    if (!p.pesoLibras) errores.pesoLibras = 'Requerido';
    else if (p.pesoLibras <= 0) errores.pesoLibras = 'Debe ser mayor a 0';
    else if (p.pesoLibras > 10000) errores.pesoLibras = 'El máximo es 10,000 lbs';

    return errores;
  });

  setErroresPaquetes(nuevosErrores);

  const hayErrores = nuevosErrores.some(e =>
    e.largo || e.alto || e.ancho || e.pesoLibras
  );

  if (hayErrores) {
    message.error('Completa todos los campos de los paquetes correctamente');
    return;
  }

  const hayVacios = paquetes.some(p => !p.contenido);
  if (hayVacios) {
    message.error('Todos los paquetes deben tener una descripción de contenido');
    return;
  }

  try {
    await OrdenesService.crear({
      direccionRecoleccion: datosPaso1.direccionRecoleccion,
      fechaProgramada: datosPaso1.fechaProgramada,
      nombreDestinatario: datosPaso1.nombreDestinatario,
      apellidoDestinatario: datosPaso1.apellidoDestinatario,
      correoDestinatario: datosPaso1.correoDestinatario,
      telefonoDestinatario: `${datosPaso1.codigoTelefono || '503'}${datosPaso1.telefonoDestinatario}`,
      direccionDestinatario: datosPaso1.direccionDestinatario,
      departamento: datosPaso1.departamento,
      municipio: datosPaso1.municipio,
      referencia: datosPaso1.referencia,
      indicaciones: datosPaso1.indicaciones,
      esCOD,
      montoEsperado: datosPaso1.montoEsperado,
      paquetes,
    });
    message.success('Orden creada exitosamente');
    localStorage.removeItem('orden_borrador');
    router.push('/ordenes');
  } catch (error: any) {
    message.error('Error al crear la orden');
  }
};

  const departamentos = [
    'San Salvador', 'Santa Ana', 'San Miguel', 'La Libertad',
    'Sonsonate', 'Usulután', 'San Vicente', 'La Paz',
    'Chalatenango', 'Cuscatlán', 'La Unión', 'Morazán',
    'Cabañas', 'Ahuachapán',
  ];

  const diasAnterioresDeshabilitados = (current: any) => {
    return current && current.isBefore(dayjs().startOf('day'));
  };

  const soloNumeros = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9.]/.test(e.key) &&
      e.key !== 'Backspace' &&
      e.key !== 'Delete' &&
      e.key !== 'Tab' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight'
    ) {
      e.preventDefault();
    }
  };

  return (
    <ConfigProvider locale={locale}>
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;500;600;700&display=swap');
          .orden-page * { font-family: 'Mona Sans', sans-serif !important; }
          .orden-page .ant-form-item-label > label {
            font-weight: 600 !important;
            color: #050817 !important;
            font-size: 12px !important;
          }
          .orden-page .ant-form-item-label > label.ant-form-item-required::before,
          .orden-page .ant-form-item-label > label.ant-form-item-required::after {
            display: none !important;
          }
          .orden-page .ant-input,
          .orden-page .ant-input-affix-wrapper,
          .orden-page .ant-picker,
          .orden-page .ant-select-selector {
            height: 40px !important;
            min-height: 40px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            display: flex !important;
            align-items: center !important;
          }
          .orden-page .ant-select-selector {
            align-items: center !important;
          }
          .orden-page .ant-form-item {
            margin-bottom: 16px !important;
          }
          .orden-page .anticon svg {
            stroke: #050817 !important;
            stroke-width: 55 !important;
            fill: #050817 !important;
          }
          .orden-page .ant-space-compact {
            display: flex !important;
            width: 100% !important;
          }
          .orden-page .ant-space-compact .ant-select .ant-select-selector {
            border-radius: 8px 0 0 8px !important;
            height: 40px !important;
            background: #f5f5f5 !important;
          }
          .orden-page .ant-space-compact .ant-input {
            border-radius: 0 8px 8px 0 !important;
            height: 40px !important;
          }
          .campo-error {
            color: #ef4444;
            font-size: 11px;
            margin-top: 3px;
            display: block;
          }
          .paquete-card {
            background: white;
            border: 1px solid #f0f0f0;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
          }
          .paquete-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
            gap: 12px;
            align-items: start;
          }
          .paquete-headers {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
            gap: 12px;
            padding: 0 16px;
            margin-bottom: 8px;
          }
          @media (max-width: 768px) {
            .paso1-grid {
              grid-template-columns: 1fr !important;
            }
            .paso1-grid > * {
              grid-column: 1 !important;
            }
            .paquete-grid {
              grid-template-columns: 1fr 1fr !important;
            }
            .paquete-headers {
              display: none !important;
            }
            .orden-page .botones-paso {
              flex-direction: column !important;
            }
            .orden-page .botones-paso button {
              width: 100% !important;
            }
          }
        `}</style>

        <div className="orden-page">
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#050817', marginBottom: 4 }}>
            Crear orden
          </h1>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 28 }}>
            Dale una ventaja competitiva a tu negocio con entregas <strong>el mismo día</strong> (Área Metropolitana) y <strong>el día siguiente</strong> a nivel nacional.
          </p>

          {paso === 1 && (
            <>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#050817', marginBottom: 20 }}>
                Completa los datos
              </h2>
              <Form
                form={form}
                layout="vertical"
                onFinish={alEnviarPaso1}
                initialValues={datosPaso1 || {}}
              >
                <div
                  className="paso1-grid"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}
                >
                  <Form.Item
                    name="direccionRecoleccion"
                    label="Dirección de recolección"
                    style={{ gridColumn: '1 / -1' }}
                    rules={[{ required: true, message: 'Requerido' }]}
                  >
                    <Input placeholder="Ej. Colonia Las Magnolias, calle militar 1, San Salvador" />
                  </Form.Item>

                  <Form.Item
                    name="fechaProgramada"
                    label="Fecha programada"
                    rules={[{ required: true, message: 'Requerido' }]}
                  >
                    <DatePicker
                      style={{ width: '100%', height: 40 }}
                      disabledDate={diasAnterioresDeshabilitados}
                    />
                  </Form.Item>

                  <Form.Item
                    name="nombreDestinatario"
                    label="Nombres"
                    rules={[{ required: true, message: 'Requerido' }]}
                  >
                    <Input placeholder="Nombre del destinatario" />
                  </Form.Item>

                  <Form.Item
                    name="apellidoDestinatario"
                    label="Apellidos"
                    rules={[{ required: true, message: 'Requerido' }]}
                  >
                    <Input placeholder="Apellido del destinatario" />
                  </Form.Item>

                  <Form.Item
                    name="correoDestinatario"
                    label="Correo electrónico"
                    rules={[{ type: 'email', message: 'Correo inválido' }]}
                  >
                    <Input placeholder="correo@ejemplo.com" />
                  </Form.Item>

                  <Form.Item label="Teléfono">
                    <Space.Compact style={{ display: 'flex', width: '100%' }}>
                      <Form.Item name="codigoTelefono" noStyle initialValue="503">
                        <Select
                          style={{ width: 85, height: 40 }}
                          suffixIcon={<span style={{ fontWeight: 900, color: '#050817' }}>▾</span>}
                        >
                          <Select.Option value="503">503</Select.Option>
                          <Select.Option value="502">502</Select.Option>
                          <Select.Option value="504">504</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name="telefonoDestinatario"
                        noStyle
                        rules={[{ required: true, message: 'Requerido' }]}
                      >
                        <Input
                          style={{ flex: 1, height: 40 }}
                          placeholder="7777 7777"
                          maxLength={8}
                          onKeyDown={soloNumeros}
                        />
                      </Form.Item>
                    </Space.Compact>
                  </Form.Item>

                  <Form.Item
                    name="direccionDestinatario"
                    label="Dirección del destinatario"
                    style={{ gridColumn: '1 / -1' }}
                    rules={[{ required: true, message: 'Requerido' }]}
                  >
                    <Input placeholder="Dirección completa" />
                  </Form.Item>

                  <Form.Item
                    name="departamento"
                    label="Departamento"
                    rules={[{ required: true, message: 'Requerido' }]}
                  >
                    <Select
                      placeholder="Seleccionar"
                      suffixIcon={<span style={{ fontWeight: 900, color: '#050817' }}>▾</span>}
                    >
                      {departamentos.map(d => (
                        <Select.Option key={d} value={d}>{d}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="municipio"
                    label="Municipio"
                    rules={[{ required: true, message: 'Requerido' }]}
                  >
                    <Input placeholder="Municipio" />
                  </Form.Item>

                  <Form.Item name="referencia" label="Punto de referencia">
                    <Input placeholder="Ej. Cerca del redondel Árbol de la Paz" />
                  </Form.Item>

                  <Form.Item name="indicaciones" label="Indicaciones">
                    <Input placeholder="Ej. Llamar antes de entregar" />
                  </Form.Item>

                  <Form.Item name="esCOD" valuePropName="checked" style={{ gridColumn: '1 / -1' }}>
                    <Checkbox onChange={(e) => setEsCOD(e.target.checked)}>
                      Cobro contra entrega (COD)
                    </Checkbox>
                  </Form.Item>

                  {esCOD && (
                    <Form.Item
                      name="montoEsperado"
                      label="Monto esperado (USD)"
                      rules={[
                        { required: true, message: 'Ingresa un monto' },
                        {
                          validator: (_, value) => {
                            if (!value || value === '') return Promise.reject('Ingresa un monto');
                            if (parseFloat(value) <= 0) return Promise.reject('El monto debe ser mayor a 0');
                            if (parseFloat(value) > 99999) return Promise.reject('El monto no puede superar $99,999');
                            return Promise.resolve();
                          }
                        }
                      ]}
                      normalize={(value) => {
                        if (!value) return value;
                        let val = value.replace(/[^0-9.]/g, '');
                        if (val.startsWith('.')) val = '';
                        const partes = val.split('.');
                        if (partes.length > 2) val = partes[0] + '.' + partes[1];
                        if (partes.length === 2) val = partes[0] + '.' + partes[1].slice(0, 2);
                        return val;
                      }}
                    >
                      <Input
                        prefix="$"
                        placeholder="0.00"
                        style={{ height: 40 }}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== 'Backspace' &&
                            e.key !== 'Delete' &&
                            e.key !== 'Tab' &&
                            e.key !== 'ArrowLeft' &&
                            e.key !== 'ArrowRight' &&
                            !(e.key === '.' && !(e.currentTarget.value.includes('.')))
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                  <Button
                    onClick={limpiarFormulario}
                    style={{
                      height: 44,
                      paddingInline: 24,
                      fontWeight: 600,
                      borderRadius: 8,
                      background: '#FF4B00',
                      borderColor: '#FF4B00',
                      color: 'white',
                    }}
                  >
                    Limpiar datos
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      background: '#3D52D5',
                      borderColor: '#3D52D5',
                      height: 44,
                      paddingInline: 32,
                      fontWeight: 600,
                      borderRadius: 8,
                    }}
                  >
                    Siguiente →
                  </Button>
                </div>
              </Form>
            </>
          )}

          {paso === 2 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <button
                  onClick={() => setPaso(1)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 20,
                    color: '#050817',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  ←
                </button>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#050817', margin: 0 }}>
                  Agrega tus productos
                </h2>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div className="paquete-headers">
                  {['Largo', 'Alto', 'Ancho', 'Peso en libras', 'Contenido'].map(h => (
                    <span key={h} style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af' }}>{h}</span>
                  ))}
                </div>

                {paquetes.map((paquete, index) => (
                  <div key={index} className="paquete-card">
                    <div className="paquete-grid">
                      <div>
                        <Input
                          value={paquete.largo || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            const num = val === '' ? null : Math.min(parseFloat(val), 10000);
                            actualizarPaquete(index, 'largo', num);
                          }}
                          onKeyDown={soloNumeros}
                          style={{ width: '100%' }}
                          suffix="cm"
                          placeholder="Ej. 15"
                          status={erroresPaquetes[index]?.largo ? 'error' : ''}
                        />
                        {erroresPaquetes[index]?.largo && (
                          <span className="campo-error">{erroresPaquetes[index].largo}</span>
                        )}
                      </div>
                      <div>
                        <Input
                          value={paquete.alto || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            const num = val === '' ? null : Math.min(parseFloat(val), 10000);
                            actualizarPaquete(index, 'alto', num);
                          }}
                          onKeyDown={soloNumeros}
                          style={{ width: '100%' }}
                          suffix="cm"
                          placeholder="Ej. 15"
                          status={erroresPaquetes[index]?.alto ? 'error' : ''}
                        />
                        {erroresPaquetes[index]?.alto && (
                          <span className="campo-error">{erroresPaquetes[index].alto}</span>
                        )}
                      </div>
                      <div>
                        <Input
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            const num = val === '' ? null : Math.min(parseFloat(val), 10000);
                            actualizarPaquete(index, 'ancho', num);
                          }}
                          onKeyDown={soloNumeros}
                          style={{ width: '100%' }}
                          suffix="cm"
                          placeholder="Ej. 15"
                          status={erroresPaquetes[index]?.ancho ? 'error' : ''}
                        />
                        {erroresPaquetes[index]?.ancho && (
                          <span className="campo-error">{erroresPaquetes[index].ancho}</span>
                        )}
                      </div>
                      <div>
                        <Input
                          value={paquete.pesoLibras || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '');
                            const num = val === '' ? null : Math.min(parseFloat(val), 10000);
                            actualizarPaquete(index, 'pesoLibras', num);
                          }}
                          onKeyDown={soloNumeros}
                          style={{ width: '100%' }}
                          suffix="lbs"
                          placeholder="Ej. 3"
                          status={erroresPaquetes[index]?.pesoLibras ? 'error' : ''}
                        />
                        {erroresPaquetes[index]?.pesoLibras && (
                          <span className="campo-error">{erroresPaquetes[index].pesoLibras}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <Input
                            value={paquete.contenido}
                            onChange={(e) => actualizarPaquete(index, 'contenido', e.target.value)}
                            placeholder="Ej. iPhone 14 Pro Max"
                            style={{ flex: 1 }}
                            status={intentoEnviar && !paquete.contenido ? 'error' : ''}
                          />
                          {paquetes.length > 1 && (
                            <button
                              onClick={() => eliminarPaquete(index)}
                              style={{
                                background: '#fee2e2',
                                border: 'none',
                                borderRadius: 6,
                                padding: '6px 10px',
                                cursor: 'pointer',
                                color: '#ef4444',
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        {intentoEnviar && !paquete.contenido && (
                          <span className="campo-error">Ingresa el contenido del paquete</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={agregarPaquete}
                  style={{
                    background: 'transparent',
                    border: '1px dashed #d1d5db',
                    borderRadius: 8,
                    padding: '10px 20px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: 14,
                    width: '100%',
                    marginTop: 4,
                  }}
                >
                  + Agregar
                </button>
              </div>

              <div
                className="botones-paso"
                style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 12 }}
              >
                <Button
                  type="primary"
                  onClick={alEnviarPaso2}
                  style={{
                    background: '#3D52D5',
                    borderColor: '#3D52D5',
                    height: 44,
                    paddingInline: 32,
                    fontWeight: 600,
                    borderRadius: 8,
                  }}
                >
                  Enviar →
                </Button>
              </div>
            </>
          )}
        </div>
      </>
    </ConfigProvider>
  );
}