export const navbarData = [
  {
    routerLink : 'dashboard',
    icon: 'dashboard.svg',
    label : 'Dashboard',
    roles : ["COMMERCANT","SUPERVISEUR"]
  },
  // {
  //   routerLink: 'operation/transac',
  //   icon : 'transactionIc.svg',
  //   label: 'Transactions',
  //   visible : true,
  //   roles : ["COMMERCANT","SUPERVISEUR"]
  // },
  {
    routerLink: 'acces',
    icon: 'user.svg',
    label: 'Agent',
    visible: true,
    roles: ["COMMERCANT","SUPERVISEUR"]
  },
  {
    routerLink: 'param/sous-reseaux',
    icon : 'zone.svg',
    label: 'Sous Reseau',
    visible : true,
    roles : ["COMMERCANT"]
  },
  {
    routerLink: 'param/sous-comptes',
    icon : 'compte.svg',
    label: 'Sous Compte',
    visible: true,
    roles: ["COMMERCANT"]
  },
  {
    routerLink: 'operation/points',
    icon : 'point.svg',
    label: 'Points',
    visible : true,
    roles : ["COMMERCANT","SUPERVISEUR"]
  },
  {
    routerLink: 'control',
    icon : 'controle.svg',
    label: 'Controle Transaction',
    visible : true,
    roles : ["COMMERCANT","SUPERVISEUR"]
  },
  {
    routerLink: 'operation/approvisionnement',
    icon: 'controle.svg',
    label: 'Demande Approvisionnement',
    visible: true,
    roles: ["COMMERCANT"]
  }
];
