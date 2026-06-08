export interface Paquete {
  contenido: string;
  pesoLibras: number;
  ancho: number;
  alto: number;
  largo: number;
}

export interface CrearOrdenPayload {
  direccionRecoleccion: string;
  fechaProgramada: string;
  nombreDestinatario: string;
  apellidoDestinatario: string;
  correoDestinatario?: string;
  telefonoDestinatario: string;
  direccionDestinatario: string;
  departamento: string;
  municipio: string;
  referencia?: string;
  indicaciones?: string;
  esCOD?: boolean;
  montoEsperado?: number;
  paquetes: Paquete[];
}

export interface Orden {
  id: string;
  orderNumber: string;
  recipientFirstName: string;
  recipientLastName: string;
  department: string;
  municipality: string;
  recipientAddress: string;
  recipientPhone: string;
  scheduledDate: string;
  status: string;
  isCOD: boolean;
  expectedAmount?: number;
  packages: { content: string; weightLbs: number }[];
}

export interface FiltrosOrden {
  estado?: string;
  esCOD?: boolean;
  nombreDestinatario?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}