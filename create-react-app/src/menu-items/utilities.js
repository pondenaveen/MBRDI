// assets
import {
  IconTypography, IconPalette, IconShadow, IconWindmill, IconUser, IconMap, IconForms, IconReportAnalytics,
  IconLayout, IconAlertOctagon, IconRoad, IconEdit, IconTag, IconDoor, IconTags, IconCalendarEvent
} from '@tabler/icons';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconUser,
  IconMap,
  IconForms,
  AssessmentIcon,
  IconReportAnalytics,
  IconLayout, IconAlertOctagon, AddAlertIcon,
  IconRoad, IconEdit, IconTag, IconDoor, IconTags, IconCalendarEvent, HistoryIcon
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  // title: 'Utilities',
  type: 'group',
  children: [


    {
      id: 'util-alerts',
      title: <span style={{ fontFamily: 'Poppins, sans-serif' }}>Rule Engine</span>,
      type: 'item',
      url: '/utils/util-alerts',
      icon: icons.AddAlertIcon,
      breadcrumbs: false
    },

    {
      id: 'util-alert/history',
      title: <span style={{ fontFamily: 'Poppins, sans-serif' }}>Alert History</span>,
      type: 'item',
      url: '/utils/util-alert/history',
      icon: icons.HistoryIcon,
      breadcrumbs: false
    },

    {
      id: 'util-reports',
      title: <span style={{ fontFamily: 'Poppins, sans-serif' }}>Reports</span>,
      type: 'item',
      url: '/utils/util-reports',
      icon: icons.AssessmentIcon,
      breadcrumbs: false
    },


  ]
};

export default utilities;