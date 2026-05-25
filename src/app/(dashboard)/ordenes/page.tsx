'use client';
import { Table, Button, DatePicker, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { OrdenesService } from '@/services/ordenes.service';

const { RangePicker } = DatePicker;

export default function PaginaHistorial() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [fechas, setFechas] = useState<any>(null);

  const cargarOrdenes = async (filtros?: any) => {
    try {
      setCargando(true);
      const datos = await OrdenesService.obtenerTodas(filtros);
      setOrdenes(datos);
    } catch {
      message.error('Error al cargar las órdenes');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const alBuscar = () => {
    const filtros: any = {};
    if (fechas) {
      filtros.fechaDesde = fechas[0]?.format('YYYY-MM-DD');
      filtros.fechaHasta = fechas[1]?.format('YYYY-MM-DD');
    }
    cargarOrdenes(filtros);
  };

  const exportarCSV = () => {
    const cabecera = 'No. Orden,Nombre,Apellidos,Departamento,Municipio,Dirección,Teléfono,Fecha Programada,Paquetes,Estado,Tipo,Monto Esperado\n';
    const filas = ordenes.map((o: any) =>
      `${o.orderNumber},${o.recipientFirstName},${o.recipientLastName},${o.department},${o.municipality},"${o.recipientAddress}",${o.recipientPhone},${o.scheduledDate ? new Date(o.scheduledDate).toLocaleDateString('es-SV') : ''},${o.packages?.length},${o.status},${o.isCOD ? 'COD' : 'Estándar'},${o.expectedAmount ?? ''}`
    ).join('\n');
    const blob = new Blob(['\ufeff' + cabecera + filas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ordenes.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const columnas = [
    {
      title: '',
      dataIndex: 'seleccionar',
      width: 40,
      render: () => <input type="checkbox" />,
    },
    {
      title: 'No. de orden',
      dataIndex: 'orderNumber',
      render: (v: string) => (
        <span style={{ fontWeight: 600, color: '#050817', fontSize: 13 }}>
          {v?.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'recipientFirstName',
      render: (v: string) => <span style={{ fontSize: 13 }}>{v}</span>,
    },
    {
      title: 'Apellidos',
      dataIndex: 'recipientLastName',
      render: (v: string) => <span style={{ fontSize: 13 }}>{v}</span>,
    },
    {
      title: 'Departamento',
      dataIndex: 'department',
      responsive: ['md'] as any,
      render: (v: string) => <span style={{ fontSize: 13 }}>{v}</span>,
    },
    {
      title: 'Municipio',
      dataIndex: 'municipality',
      responsive: ['md'] as any,
      render: (v: string) => <span style={{ fontSize: 13 }}>{v}</span>,
    },
    {
      title: 'Paquetes en orden',
      dataIndex: 'packages',
      render: (p: any[]) => (
        <Tag color="green" style={{ fontWeight: 700, borderRadius: 20 }}>
          {p?.length}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;500;600;700&display=swap');
        .historial-page * { font-family: 'Mona Sans', sans-serif !important; }
        .historial-page .ant-table-thead > tr > th {
          background: #f9fafb !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          color: #6b7280 !important;
          border-bottom: 1px solid #f0f0f0 !important;
        }
        .historial-page .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f9fafb !important;
          padding: 14px 16px !important;
        }
        .historial-page .ant-table-tbody > tr:hover > td {
          background: #f9fafb !important;
        }
        .historial-page .ant-picker {
          height: 40px !important;
          border-radius: 8px !important;
        }
        @media (max-width: 768px) {
          .historial-filtros {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .historial-filtros .ant-picker {
            width: 100% !important;
          }
          .historial-filtros .ant-btn {
            width: 100% !important;
          }
          .historial-page .ant-table {
            font-size: 12px !important;
          }
          .historial-page .ant-table-thead > tr > th,
          .historial-page .ant-table-tbody > tr > td {
            padding: 10px 8px !important;
          }
        }
      `}</style>

      <div className="historial-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#050817', margin: 0 }}>
            Mis <span style={{ fontWeight: 700 }}>envíos</span>
          </h1>
        </div>

        <div
          className="historial-filtros"
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
          }}
        >
          <RangePicker
            onChange={(v) => setFechas(v)}
            placeholder={['Fecha inicio', 'Fecha fin']}
            style={{ height: 40 }}
          />
          <Button
            type="primary"
            onClick={alBuscar}
            style={{
              background: '#3D52D5',
              borderColor: '#3D52D5',
              height: 40,
              paddingInline: 24,
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Buscar
          </Button>
          <Button
            onClick={exportarCSV}
            style={{
              height: 40,
              paddingInline: 24,
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Descargar órdenes
          </Button>
        </div>

        <div style={{
          background: 'white',
          borderRadius: 12,
          border: '1px solid #f0f0f0',
          overflow: 'hidden',
        }}>
          <Table
            dataSource={ordenes}
            columns={columnas}
            rowKey="id"
            loading={cargando}
            pagination={false}
            scroll={{ x: true }}
            locale={{ emptyText: 'No hay órdenes registradas' }}
          />
        </div>
      </div>
    </>
  );
}