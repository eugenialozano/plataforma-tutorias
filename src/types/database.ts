export type RolUsuario =
  | "tutorado"
  | "tutor"
  | "psicologo"
  | "medico"
  | "coordinador"
  | "admin";

export interface Plantel {
  id: string;
  nombre: string;
  clave: string | null;
  created_at: string;
}

export interface Perfil {
  id: string;
  plantel_id: string | null;
  rol: RolUsuario;
  nombre_completo: string;
  email: string;
  created_at: string;
}

export interface Grupo {
  id: string;
  plantel_id: string;
  tutor_id: string | null;
  carrera: string;
  semestre: string;
  ciclo_escolar: string;
  nombre: string | null;
  created_at: string;
}

export interface Tutorado {
  id: string;
  grupo_id: string | null;
  numero_control: string | null;
  carrera: string | null;
  semestre: string | null;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  nombres: string | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  lugar_nacimiento: string | null;
  estado_civil: string | null;
  numero_hijos: number | null;
  telefono_domicilio: string | null;
  celular1: string | null;
  celular2: string | null;
  domicilio_actual: string | null;
  escolaridad_previa: string | null;
  nombre_institucion_previa: string | null;
  becado: boolean;
  tipo_beca: string | null;
  vive_con: string | null;
  trabaja: boolean;
  nombre_empresa: string | null;
  horario_trabajo: string | null;
  escolaridad_padre: string | null;
  escolaridad_madre: string | null;
  padre_vive: boolean | null;
  madre_vive: boolean | null;
  trabajo_padre: string | null;
  trabajo_madre: string | null;
  contacto_emergencia_nombre: string | null;
  contacto_emergencia_telefono: string | null;
  updated_at: string;
}
