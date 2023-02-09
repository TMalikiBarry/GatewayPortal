export const navbarData = [
  {
    routerLink : 'dashboard',
    icon: 'dashboard',
    label : 'Dashboard',
    roles : ["COMMERCANT","SUPERVISEUR"]
  },
  {
    icon: 'settings',
    label : 'Parametre',
    dropDown : false,
    roles : ["COMMERCANT","SUPERVISEUR"],
    items : [
      {
        routerLink : 'reseaux',
        icon: 'account_balance',
        label : 'Reseaux',
        visible : true,
        roles : ["COMMERCANT","SUPERVISEUR"]
      }
    ]
  },
  {
    icon: 'security',
    label : 'Securite',
    dropDown : false,
    roles : ["COMMERCANT"],
    items : [
      {
        routerLink : 'acces',
        icon: 'person',
        label : 'Acces',
        visible : true,
        roles : ["COMMERCANT"]
      }
    ]
  }
];
