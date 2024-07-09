import { House, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <nav className='mx-auto mt-4 w-fit rounded-lg bg-neutral-300 p-2 py-1.5 dark:bg-neutral-900/90'>
      <ul className='flex items-center justify-center gap-2'>
        <li>
          <Link to='/'>
            <Button size='icon' variant='ghost'>
              <House className='h-5 w-5' />
            </Button>
          </Link>
        </li>
        <li>
          <Link to='/settings'>
            <Button size='icon' variant='ghost'>
              <Settings className='h-5 w-5' />
            </Button>
          </Link>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
