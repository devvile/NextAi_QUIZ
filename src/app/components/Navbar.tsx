"use client"
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Quiz App
          </Link>
        </Typography>
        
        <Button 
          color="inherit" 
          component={Link}
          href="/"
          variant={isActive('/') ? 'outlined' : 'text'}
          sx={{ mr: 2 }}
        >
          Generate Quiz
        </Button>
        
        <Button 
          color="inherit" 
          component={Link}
          href="/quizzes"
          variant={isActive('/quizzes') ? 'outlined' : 'text'}
        >
          My Quizzes
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;