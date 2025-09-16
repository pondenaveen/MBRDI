import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';


const FirstDetails = Loadable(lazy(() => import('views/settings/All_IAQ')));
const SecondDetails = Loadable(lazy(() => import('views/settings/Second_details')));
// const AllDetails = Loadable(lazy(() => import('views/settings/All_IAQ')));

const F1_1 = Loadable(lazy(() => import('views/settings/F1_1')));
const F1_2 = Loadable(lazy(() => import('views/settings/F1_2')));
const AllIAQ = Loadable(lazy(() => import('views/settings/All_IAQ')));

const SettingsRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/Settings/fisrt/first-floor-details',
            element: <FirstDetails />
        },
        {
            path: '/Settings/second/second-floor-details',
            element: <SecondDetails />
        },

        {
            path: '/Settings/Floor1/IAQ1',
            element: <F1_1 />
        },

        {
            path: '/Settings/Floor1/All',
            element: <AllIAQ />
        },

        {
            path: '/Settings/Floor1/IAQ1',
            element: <F1_2 />
        },

    ]
};

export default SettingsRoutes;
