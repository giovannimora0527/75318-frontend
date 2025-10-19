export interface NavigationItem {
<<<<<<< HEAD
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
=======
  id?: string;
  title?: string;
  type: 'group' | 'collapse' | 'item'; // <-- Agregamos 'collapse'
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
<<<<<<< HEAD
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;

  children?: NavigationItem[];
}
export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Inicio',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'usuario',
        title: 'Gestión de Usuarios',
        type: 'item',
        url: '/inicio/usuario',
        icon: 'feather icon-user',
        classes: 'nav-item'
      },
      {
        id: 'medico',
        title: 'Gestión de Medicos',
        type: 'item',
        url: '/inicio/medico',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
      {
        id: 'paciente',
        title: 'Gestión de Pacientes',
        type: 'item',
        url: '/inicio/paciente',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      },
      {
        id: 'medicamento',
        title: 'Gestión de medicamentos',
        type: 'item',
        url: '/inicio/medicamento',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      },
      {
        id: 'cita',
        title: 'Gestión de citas',
        type: 'item',
        url: '/inicio/cita',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      },
      {
        id: 'formula',
        title: 'Gestión de formulas medicas',
        type: 'item',
        url: '/inicio/formula-medica',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      },
      {
        id: 'historia',
        title: 'Gestión de historias clinicas',
        type: 'item',
        url: '/inicio/historia-clinica',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      },
      {
        id: 'especializacion',
        title: 'Gestión de especializaciones',
        type: 'item',
        url: '/inicio/especializacion',
        icon: 'feather icon-user-check',
        classes: 'nav-item'
      }
    ]
  },
  /* ---------- Nuevos menus aqui -------------  */
];
=======
  classes?: string; // <-- NUEVO
  target?: boolean; // <-- NUEVO
  external?: boolean; // <-- NUEVO
  breadcrumbs?: boolean;
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'gestion',
    title: 'Gestión Clínica',
    type: 'group',
    icon: 'feather icon-layers',
    children: [
      {
        id: 'usuarios',
        title: 'Usuarios',
        type: 'item',
        url: '/inicio/usuario',
        icon: 'feather icon-users',
        classes: '',
      },
      {
        id: 'medicos',
        title: 'Médicos',
        type: 'item',
        url: '/inicio/medico',
        icon: 'feather icon-user',
        classes: '',
      },
      {
        id: 'pacientes',
        title: 'Pacientes',
        type: 'item',
        url: '/inicio/paciente',
        icon: 'feather icon-user-check',
        classes: '',
      },
      {
        id: 'citas',
        title: 'Citas',
        type: 'item',
        url: '/inicio/citas',
        icon: 'feather icon-calendar',
        classes: '',
      },
      {
        id: 'medicamentos',
        title: 'Medicamentos',
        type: 'item',
        url: '/inicio/medicamentos',
        icon: 'feather icon-layers',
        classes: '',
      },
      {
        id: 'formulas-medicas',
        title: 'Fórmulas Médicas',
        type: 'item',
        url: '/inicio/formulas-medicas',
        icon: 'feather icon-file-text',
        classes: '',
      },
      {
        id: 'historias-medicas',
        title: 'Historias Médicas',
        type: 'item',
        url: '/inicio/historias-medicas',
        icon: 'feather icon-book-open',
        classes: '',
      }
    ]
  }
];

>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
