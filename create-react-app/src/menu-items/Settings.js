// assets
import { IconSettingsAutomation } from '@tabler/icons';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

// constant
const icons = {
    IconSettingsAutomation,DeviceThermostatIcon
};



// ==============================|| EXTRA Settings MENU ITEMS ||============================== //
const Settings = {
    id: 'Settings',
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: <span style={{ fontFamily: 'Poppins, sans-serif' }}>Floorwise IAQ</span>,
            type: 'collapse',
            icon: icons.DeviceThermostatIcon,

            children: [
                {
                    id: 'first-floor-details',
                    title: <span style={{ fontFamily: 'Poppins, sans-serif' }}>EC1-6th Floor</span>,
                    type: 'item',
                    url: '/Settings/fisrt/first-floor-details'
                },

                {
                    id: 'second-floor-details',
                    title: <span style={{ fontFamily: 'Poppins, sans-serif' }}>Second Floor</span>,
                    type: 'item',
                    url: '/Settings/second/second-floor-details'
                },

                
            ]
        }
    ]
};

export default Settings;

