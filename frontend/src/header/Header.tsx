import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useDarkMode } from './contexts/useDarkMode';

const pages = ['Game list'];
const links = [{name: 'Wordle', link: '/wordle'}, {name: 'Connections', link: '/connections'}];

function Header() {

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{backgroundColor: isDarkMode ? '#EF2400' : 'rgb(197,5,12)'}}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <a href="/">
            <SportsEsportsIcon sx={{color: isDarkMode ? 'black' : 'white'}} />
          </a>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: isDarkMode ? 'black' : 'white',
              textDecoration: 'none',
            }}
          >
            NYTC Games
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
            <>
              <Button
                key={page}
                onClick={handleOpenUserMenu}
                sx={{ my: 2, color: isDarkMode ? 'black' : 'white', display: 'block' }}
              >
                {page}
              </Button>
              <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseUserMenu}
            >
              {links.map((link) => (
                <MenuItem key={link.name} onClick={handleCloseUserMenu}>
                  <a href={link.link}>
                    {link.name}
                    </a>
                </MenuItem>
              ))}
            </Menu>
            </>  
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}>
              <IconButton onClick={toggleDarkMode} >
                {isDarkMode ? 
                <DarkModeIcon sx={{color:'black'}}/>
                : <LightModeIcon sx={{color:'white'}}/> 
                }
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;