// import { useSelector } from 'react-redux';

// import { ThemeProvider } from '@mui/material/styles';
// import { CssBaseline, StyledEngineProvider } from '@mui/material';
// import AuthFooter from 'ui-component/cards/AuthFooter';

// // routing
// import Routes from 'routes';

// // defaultTheme
// import themes from 'themes';

// // project imports
// import NavigationScroll from 'layout/NavigationScroll';


// // ==============================|| APP ||============================== //

// const App = () => {
//   const customization = useSelector((state) => state.customization);

//   return (
//     <StyledEngineProvider injectFirst>
//       <ThemeProvider theme={themes(customization)}>
//         <CssBaseline />
//         <NavigationScroll>
//           <Routes />
//           <AuthFooter />
//         </NavigationScroll>
//       </ThemeProvider>
//     </StyledEngineProvider>
//   );
// };

// export default App;

import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { useLocation } from 'react-router-dom';  // Import useLocation
import AuthFooter from 'ui-component/cards/AuthFooter';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);
  const location = useLocation(); // Get the current location

  // Define routes where the footer should not be displayed
  const noFooterRoutes = ['/pages/login/login3', '/pages/register/register3'];

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <Routes />
          {!noFooterRoutes.includes(location.pathname) && <AuthFooter />}
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;





