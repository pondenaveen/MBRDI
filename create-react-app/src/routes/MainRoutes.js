import React from 'react';
import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import SettingsRoutes from './SettingsRoutes';



const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

const Alerts = Loadable(lazy(() => import('views/utilities/Alert')));
const Reports = Loadable(lazy(() => import('views/utilities/Report')));

const Addalert = Loadable(lazy(() => import('views/utilities/Add_alert')));
const ALertHistory = Loadable(lazy(() => import('views/utilities/ALerthistory')));



const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },


    {
      path: 'utils',
      children: [

        {
          path: '/utils/util-alerts',
          element: <Alerts />
        },

        {
          path: '/utils/util-reports',
          element: <Reports />
        },

        {
          path: '/utils/util-add-alert',
          element: <Addalert />
        },

        {
          path: '/utils/util-alert/history',
          element: <ALertHistory />
        },

      ]
    },


    SettingsRoutes,

  ]
};

export default MainRoutes;