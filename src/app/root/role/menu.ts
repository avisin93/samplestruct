
export class Menus {

  public static menus: Array<any> = [];
  public static tmpMenus: Array<any> = [
    {
      name: 'Dashboard',
      key: 'dashboard',
      link: 'dashboard',
      icon: 'fa fa-dashboard',
      roles: ['test'],
      submenus: []
    },
    {
      name: 'Contracts',
      key: 'contracts',
      link: 'no-link',
      icon: 'fa fa-list',
      roles: ['test'],
      submenus: [
        {
          name: 'Contract List',
          key: 'contract-list',
          link: 'contract-list',
          icon: '',
          roles: ['test'],
          submenus: []
        },
        {
          name: 'Doc Search',
          key: 'doc-search',
          link: 'doc-search',
          icon: '',
          roles: ['test'],
          submenus: []
        }
      ]
    },
    {
      name: 'Notification',
      key: 'notification',
      link: 'notification/notification-list',
      icon: 'fa fa-calendar',
      roles: ['test'],
      submenus: []
    }
  ];
  // [
  //   {
  //     name: 'Operator',
  //     key: 'operator',
  //     link: 'operator',
  //     icon: 'fa fa-envelope',
  //     roles: ['super-admin','client-admin']
  //   },
  //   {
  //     name: 'Recipient Inbox',
  //     key: 'recipient-inbox',
  //     link: 'recipient-inbox',
  //     icon: 'fa fa-file',
  //     roles: ['super-admin','client-admin']
  //   }
  // ];

  // [
  //   {
  //     name: 'Dashboard',
  //     key: 'dashboard',
  //     link: 'dashboard',
  //     icon: 'icon-ic_dashboard_black_36px3',
  //     roles: ['super-admin', 'client-admin', 'client-user']
  //   },
  //   {
  //     name: 'Client Setup',
  //     key: 'client-setup',
  //     link: 'client-setup',
  //     icon: 'icon-ic_insert_drive_file_black_36px3',
  //     tabs: [
  //       {
  //         name: 'Information',
  //         key: 'information-tab',
  //         visible: true
  //       },
  //       {
  //         name: 'Assign Storefront',
  //         key: 'assign-storefront-tab',
  //         visible: true
  //       },
  //       {
  //         name: 'Facilities',
  //         key: 'facilities-tab',
  //         visible: true
  //       },
  //       {
  //         name: 'Feature Setup',
  //         key: 'feature-setup-tab',
  //         visible: true
  //       },
  //       {
  //         name: 'Pricing',
  //         key: 'pricing-tab',
  //         visible: true
  //       },
  //       {
  //         name: 'Site Settings',
  //         key: 'site-settings-tab',
  //         visible: true
  //       },
  //       {
  //         name: 'Module License',
  //         key: 'module-license-tab',
  //         visible: true
  //       }
  //     ],
  //     roles: ['super-admin', 'client-admin']
  //   },
  //   {
  //     name: 'Menu Setup',
  //     key: 'menu-setup',
  //     link: 'menu-setup',
  //     icon: 'fa fa-user',
  //     roles: ['super-admin', 'client-admin']
  //   },
  //   {
  //     name: 'Role',
  //     key: 'role',
  //     link: 'role',
  //     icon: 'fa fa-cogs',
  //     roles: ['super-admin', 'client-admin']
  //   },
  //   {
  //     name: 'Role Setup',
  //     key: 'role-setup',
  //     link: 'role-setup',
  //     icon: 'fa fa-check-square-o',
  //     roles: ['super-admin', 'client-admin']
  //   },
  //   {
  //     name: 'Doc Type',
  //     key: 'doc-type',
  //     link: 'doc-type',
  //     icon: 'fa fa-sitemap',
  //     roles: ['super-admin', 'client-admin']
  //   },
  //   {
  //     name: 'Queue Setup',
  //     key: 'queue-setup',
  //     link: 'queue-setup',
  //     icon: 'fa fa-wrench',
  //     roles: ['super-admin']
  //   },
  //   {
  //     name: 'Project Setup',
  //     key: 'project-setup',
  //     link: 'project-setup',
  //     icon: 'fa fa-list',
  //     roles: ['super-admin'],
  //     tabs: [
  //       {
  //         name: 'Information',
  //         key: 'information-tab',
  //         visible: true
  //       },
  //       {
  //         name: 'Project-User',
  //         key: 'project-user-tab',
  //         visible: true
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Registered User',
  //     key: 'registered-user',
  //     link: 'registered-user',
  //     icon: 'fa fa-user',
  //     roles: ['super-admin']
  //   },
  //   {
  //     name: 'User Permissions',
  //     key: 'user-permissions',
  //     link: 'user-permissions',
  //     icon: 'fa fa-check-square-o',
  //     roles: ['super-admin', 'client-admin']
  //   },
  //   {
  //     name: 'User Queue Setup',
  //     key: 'user-queue-setup',
  //     link: 'user-queue-setup',
  //     icon: 'fa fa-barcode',
  //     roles: ['super-admin','client-admin']
  //   },
  //   {
  //     name: 'Operator',
  //     key: 'operator',
  //     link: 'operator',
  //     icon: 'fa fa-sitemap',
  //     roles: ['super-admin','client-admin']
  //   },
  //   {
  //     name: 'Recipient Inbox',
  //     key: 'recipient-inbox',
  //     link: 'recipient-inbox',
  //     icon: 'fa fa-file',
  //     roles: ['super-admin','client-admin']
  //   },
  //   {
  //     name: 'Vendor Setup',
  //     key: 'vendor-setup',
  //     link: 'vendor-setup',
  //     icon: 'fa fa-handshake-o',
  //     tabs: [
  //       {
  //         name: 'Information',
  //         key: 'information-tab',
  //         visible: true
  //       },
  //       {
  //         name: 'Facilities',
  //         key: 'facilities-tab',
  //         visible: true
  //       },
  //       {
  //         name: 'Feature Setup',
  //         key: 'feature-setup-tab',
  //         visible: true
  //       },
  //       {
  //         name: 'Pricing',
  //         key: 'pricing-tab',
  //         visible: true
  //       },
  //       {
  //         name: 'Products',
  //         key: 'products-tab',
  //         visible: true
  //       }
  //     ],
  //     roles: ['super-admin']
  //   },
  //   {
  //     name: 'Vendor Mapper',
  //     key: 'vendor-facility-mapper',
  //     link: 'vendor-facility-mapper',
  //     icon: 'fa fa-sitemap',
  //     roles: ['super-admin']
  //   },
  //   {
  //     name: 'Product List',
  //     key: 'product-list',
  //     link: 'product-list',
  //     icon: 'fa fa-list',
  //     roles: ['super-admin']
  //   },
  //   {
  //     name: 'Storefront Setup',
  //     link: 'storefront-setup',
  //     icon: 'fa fa-university',
  //     roles: ['super-admin']
  //   },
  //   {
  //     name: 'Print Products',
  //     key: 'print-products',
  //     link: 'print-products',
  //     icon: 'fa fa-file',
  //     roles: ['client-user']
  //   },
  //   {
  //     name: 'Job List',
  //     key: 'job-list',
  //     link: 'job-list',
  //     icon: 'icon-ic_print_black_24px3',
  //     roles: ['client-admin']
  //   },
  //   {
  //     name: 'Jobs',
  //     key: 'jobs',
  //     link: 'jobs',
  //     icon: 'icon-ic_print_black_24px3',
  //     roles: ['client-user']
  //   },
  //   {
  //     name: 'User Setup',
  //     key: 'user-setup',
  //     link: 'user-setup',
  //     icon: 'fa fa-user',
  //     roles: ['super-admin', 'client-admin']
  //   },
  //   {
  //     name: 'Cost Center',
  //     key: 'cost-center',
  //     link: 'cost-center',
  //     icon: 'icon-costCenter3',
  //     roles: ['client-admin']
  //   },
  //   {
  //     name: 'Deal Code',
  //     key: 'deal-code',
  //     link: 'deal-code',
  //     icon: 'fa fa-barcode',
  //     roles: ['client-admin']
  //   },
  //   {
  //     name: 'Reports',
  //     key: 'reports',
  //     link: 'reports',
  //     icon: 'icon-report3',
  //     roles: ['super-admin', 'client-admin']
  //   },
  //   {
  //     name: 'Invitation',
  //     key: 'invitation',
  //     link: 'invitation',
  //     icon: 'fa fa-user',
  //     roles: ['client-user']
  //   }
  // ];

  public static getMenus (role: string): Array<any> {
    return this.menus.filter(function (menu) {
      return (typeof menu.roles !== 'undefined') ? menu.roles.indexOf(role) > -1 : false;
    });
  }

  public static getMenuTabs (key: string) {
    if (this.menus.length > 0) {
      return this.menus.find((item: any) => {
        return item.key === key;
      });
    }
    return [];
  }
}
