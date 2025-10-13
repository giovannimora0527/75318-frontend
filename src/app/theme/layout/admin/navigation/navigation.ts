export interface NavigationItem {
  id?: string;
  title?: string;
  type: 'group' | 'collapse' | 'item'; // <-- Agregamos 'collapse'
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
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

