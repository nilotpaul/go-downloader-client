import Menu from './components/Menu';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Menu />

      <div className='mx-auto mt-12 max-w-5xl px-3'>
        <Outlet />
      </div>
    </>
  );
};

export default App;
