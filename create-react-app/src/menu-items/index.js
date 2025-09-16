import dashboard from './dashboard';
import utilities from './utilities';
import './Menu.css';
import Settings from './Settings';



const menuItems = {
  items: [dashboard, Settings, utilities,]
};

export default menuItems;



// import dashboard from './dashboard';
// import utilities from './utilities';
// import Settings from './Settings';



// // Get user role from local storage
// const userRole = localStorage.getItem('userRole');
// // console.log('User Role from Local Storage:', userRole);


// // Define the roles and their corresponding permissions
// const rolesAndPermissions = {
//   Admin: [dashboard, Settings, utilities],

// };

// // Get the menu items based on the user's role
// const menuItems = {
//   items: rolesAndPermissions[userRole] || [] // Default to an empty array if userRole is not found
// };

// export default menuItems;
