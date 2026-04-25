import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import { pageNames, settings } from "../utils/constants";
import { useNavigate, useLocation } from "react-router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import PeopleIcon from "@mui/icons-material/People";
import useAuthStore, { type AuthUser } from "../stores/useAuthStore";

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:600px)");
  const user: AuthUser | null = useAuthStore((state) => state.user);
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 45%)`;
  };

  // Map page names to their corresponding icons
  const iconMap: Record<string, React.ReactNode> = {
    "/transactions": <SwapCallsIcon />,
    "/dashboard": <DashboardIcon />,
    "/profiles": <PeopleIcon />,
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (redirectTo: string) => {
    navigate(`/${redirectTo}`);
    setAnchorElUser(null);
  };

  const handleBottomNavChange = (
    _event: React.SyntheticEvent,
    newValue: string,
  ) => {
    navigate(newValue);
  };

  // Desktop Navigation
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/transactions"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img
              src="/fair-track.png"
              alt="FairTrack"
              width="100"
              height="40"
            />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pageNames.map((page) => (
              <Button
                key={page.name}
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={() => navigate(page.path)}
              >
                {page.name}
              </Button>
            ))}
          </Box>
           <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: stringToColor(user?.username || "") }}>
                  {user?.username.charAt(0).toUpperCase()}
                </Avatar>
                {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.name}
                  onClick={() => handleMenuItemClick(setting.path)}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      {isMobile && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
          elevation={3}
        >
          <BottomNavigation
            value={location.pathname}
            onChange={handleBottomNavChange}
            sx={{
              borderTop: "1px solid #e0e0e0",
            }}
          >
            {pageNames.map((page) => (
              <BottomNavigationAction
                key={page.path}
                label={page.name}
                value={page.path}
                icon={iconMap[page.path]}
                sx={{
                  py: 1,
                  "&.Mui-selected": {
                    color: "primary.main",
                  },
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </AppBar>
  );
}
export default ResponsiveAppBar;
