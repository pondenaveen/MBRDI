// assets
import { IconDashboard } from '@tabler/icons';


// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: <span style={{ fontFamily: 'Poppins, sans-serif' }}>Dashboard</span>,
  type: 'group',
  children: [
    {
      id: 'default',
      title: <span style={{ fontFamily: 'Poppins, sans-serif' }}>Executive Dashboard</span>,
      // title: 'Executive Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
  ]
};

export default dashboard;


