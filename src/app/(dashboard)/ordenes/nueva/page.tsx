'use client';
import { Form, Input, Button, DatePicker, Select, InputNumber, Checkbox, message, ConfigProvider } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrdenesService } from '@/services/ordenes.service';
import locale from 'antd/locale/es_ES';

export default function PaginaNuevaOrden() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [datosPaso1, setDatosPaso1] = useState<any>(null);
  const [esCOD, setEsCOD] = useState(false);
  const [paquetes, setPaquetes] = useState([
    { contenido: '', pesoLibras: 0, ancho: 0, alto: 0, largo: 0 }
  ]);

  const alEnviarPaso1 = (valores: any) => {
    setDatosPaso1(valores);
    setPaso(2);
  };

  const agregarPaquete = () => {
    setPaquetes([...paquetes, { contenido: '', pesoLibras: 0, ancho: 0, alto: 0, largo: 0 }]);
  };

  const eliminarPaquete = (index: number) => {
    setPaquetes(paquetes.filter((_, i) => i !== index));
  };

  const actualizarPaquete = (index: number, campo: string, valor: any) => {
    const nuevos = [...paquetes];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setPaquetes(nuevos);
  };

  const alEnviarPaso2 = async () => {
    try {
      await OrdenesService.crear({
        direccionRecoleccion: datosPaso1.direccionRecoleccion,
        fechaProgramada: datosPaso1.fechaProgramada?.format('YYYY-MM-DD'),
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
          .orden-page .ant-select-selector,
          .orden-page .ant-input-number {
            height: 40px !important;
            min-height: 40px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            display: flex !important;
            align-items: center !important;
          }
          .orden-page .ant-input-number-input {
            height: 38px !important;
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
          .orden-page .ant-input-group-compact {
            display: flex !important;
            height: 40px !important;
          }
          .orden-page .ant-input-group-compact .ant-select .ant-select-selector {
            border-radius: 8px 0 0 8px !important;
            height: 40px !important;
            background: #f5f5f5 !important;
          }
          .orden-page .ant-input-group-compact .ant-input {
            border-radius: 0 8px 8px 0 !important;
            height: 40px !important;
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
            align-items: end;
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
              <Form layout="vertical" onFinish={alEnviarPaso1}>
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
                    <DatePicker style={{ width: '100%', height: 40 }} />
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

                  <Form.Item label="Teléfono" rules={[{ required: true, message: 'Requerido' }]}>
                    <Input.Group compact style={{ display: 'flex', height: 40 }}>
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
                          style={{ flex: 1, height: 40, borderRadius: '0 8px 8px 0' }}
                          placeholder="7777 7777"
                        />
                      </Form.Item>
                    </Input.Group>
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
                    <Form.Item name="montoEsperado" label="Monto esperado (USD)">
                      <InputNumber
                        min={0}
                        prefix="$"
                        style={{ width: '100%', height: 40 }}
                      />
                    </Form.Item>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
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
                      width: '100%',
                      maxWidth: 200,
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
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#050817', marginBottom: 20 }}>
                Agrega tus productos
              </h2>

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
                        <InputNumber
                          min={0}
                          value={paquete.largo}
                          onChange={(v) => actualizarPaquete(index, 'largo', v)}
                          style={{ width: '100%' }}
                          addonAfter="cm"
                        />
                      </div>
                      <div>
                        <InputNumber
                          min={0}
                          value={paquete.alto}
                          onChange={(v) => actualizarPaquete(index, 'alto', v)}
                          style={{ width: '100%' }}
                          addonAfter="cm"
                        />
                      </div>
                      <div>
                        <InputNumber
                          min={0}
                          value={paquete.ancho}
                          onChange={(v) => actualizarPaquete(index, 'ancho', v)}
                          style={{ width: '100%' }}
                          addonAfter="cm"
                        />
                      </div>
                      <div>
                        <InputNumber
                          min={0}
                          value={paquete.pesoLibras}
                          onChange={(v) => actualizarPaquete(index, 'pesoLibras', v)}
                          style={{ width: '100%' }}
                          addonAfter="lbs"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Input
                          value={paquete.contenido}
                          onChange={(e) => actualizarPaquete(index, 'contenido', e.target.value)}
                          placeholder="Ej. iPhone 14 Pro Max"
                          style={{ flex: 1 }}
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
                            }}
                          >
                            ✕
                          </button>
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
                style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, gap: 12 }}
              >
                <Button
                  onClick={() => setPaso(1)}
                  style={{ height: 44, paddingInline: 32, borderRadius: 8, flex: 1, maxWidth: 200 }}
                >
                  ← Regresar
                </Button>
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
                    flex: 1,
                    maxWidth: 200,
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