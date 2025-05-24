import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Petrochemistry Games', path: '/educational-games' },
  { name: 'Nuclear Engineering', path: '/nuclear-engineering' },
  { name: 'Electrical Engineering', path: '/electrical-engineering' },
  { name: 'Rocket Science', path: '/rocket-science' },
  { name: 'Health Optimization', path: '/health' },
  { name: 'Biochemistry', path: '/biochemistry' },
  { name: 'Molecular Biotechnology', path: '/molecular-biotechnology' },
  { name: 'Contact', path: '/contact' }
  
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElMore, setAnchorElMore] = useState(null);
  const [visibleCount, setVisibleCount] = useState(pages.length);
  const containerRef = useRef();
  const itemRefs = useRef([]);

  // Measure and update visibleCount on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      // const containerWidth = containerRef.current.offsetWidth;
      // let usedWidth = 0;
      // let fitCount = 0;
      // for (let i = 0; i < pages.length; i++) {
      //   const itemWidth = itemRefs.current[i]?.offsetWidth || 0;
      //   usedWidth += itemWidth + 16;
      //   if (usedWidth > containerWidth - 80) break;
      //   fitCount++;
      // }
      // setVisibleCount(fitCount);
      setVisibleCount(3); // Force only 3 items to show for testing
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenMoreMenu = (event) => {
    setAnchorElMore(event.currentTarget);
  };

  const handleCloseMoreMenu = () => {
    setAnchorElMore(null);
  };

  const mainPages = pages.slice(0, visibleCount);
  const morePages = pages.slice(visibleCount);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo and title for large screens */}
          <WifiTetheringIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            RF SOLUTIONS
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu} component={RouterLink} to={page.path}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo and title for small screens */}
          <WifiTetheringIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            RF
          </Typography>

          {/* Desktop menu */}
          <Box ref={containerRef} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, whiteSpace: 'nowrap', overflow: 'hidden', minWidth: 0, flexShrink: 1 }}>
            {mainPages.map((page, i) => (
              <Button
                key={page.name}
                ref={el => itemRefs.current[i] = el}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 140 }}
              >
                {page.name}
              </Button>
            ))}
            {morePages.length > 0 && (
              <>
                <Button
                  color="inherit"
                  onClick={handleOpenMoreMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  More
                </Button>
                <Menu
                  anchorEl={anchorElMore}
                  open={Boolean(anchorElMore)}
                  onClose={handleCloseMoreMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  {morePages.map((page) => (
                    <MenuItem
                      key={page.name}
                      component={RouterLink}
                      to={page.path}
                      onClick={handleCloseMoreMenu}
                    >
                      {page.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
            <Button
              color="inherit"
              component={RouterLink}
              to="/neuro-quiz"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 140 }}
            >
              Neuro Quiz
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
