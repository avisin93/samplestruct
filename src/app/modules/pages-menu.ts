export const MENU_ITEMS: Object[] = [
  {
    title: 'Dashboard',
    icon: 'fa fa-tachometer-alt',
    link: '/pages/dashboard',
    children: [
      {
        title: 'Events and Reminders',
        link: '/pages/dashboard/events-and-reminders'
      }
    ]
  },
  {
    title: 'Contracts',
    icon: 'fa fa-list',
    link: '/pages/contracts',
    links: true,
    children: [
      {
        title: 'Contract List',
        link: '/pages/contracts/contract-list', // TODO
        links: true
      },
      {
        title: 'Doc Search',
        link: '/pages/contracts/doc-search'
      }
    ]
  },
  {
    title: 'Notification',
    link: '/pages/notification/notification-list',
    icon: 'fa fa-calendar'
  }
];
