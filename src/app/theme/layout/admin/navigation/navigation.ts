export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
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
        title: 'Gestión de Médicos',
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
        id: 'medicamentos',
        title: 'Medicamentos',
        type: 'item',
        url: '/inicio/medicamentos',
        icon: 'feather icon-package', 
        classes: 'nav-item'
      },
      {
        id: 'citas',
        title: 'Citas',
        type: 'item',
        url: '/inicio/citas',
        icon: 'feather icon-calendar', 
        classes: 'nav-item'
      },
      {
        id: 'formulas-medicas',
        title: 'Fórmulas Médicas',
        type: 'item',
        url: '/inicio/formulas-medicas',
        icon: 'feather icon-file-text', 
        classes: 'nav-item'
      },
      {
        id: 'historias-medicas',
        title: 'Historias Médicas',
        type: 'item',
        url: '/inicio/historias-medicas',
        icon: 'feather icon-book', 
        classes: 'nav-item'
      },
      {
        id: 'gestion-especializaciones',
        title: 'Gestión de Especializaciones',
        type: 'item',
        url: '/inicio/gestion-especializaciones',
        icon: 'feather icon-briefcase', 
        classes: 'nav-item'
      },
      {
        id: 'auditoria',
        title: 'Logs de Auditoría',
        type: 'item',
        url: '/inicio/auditoria',
        icon: 'feather icon-shield',
        classes: 'nav-item'
      }
    ]
  }
];