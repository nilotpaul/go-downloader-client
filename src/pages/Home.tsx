import DownloadForm from '@/components/DownloadForm';
import Progress from '@/components/Progress';
import { useHealth } from '@/hooks/useHealth';

const Home = () => {
  const { isHealthy, queryResult } = useHealth();

  return (
    <>
      {!queryResult.isPending ? (
        <p className='my-6 font-medium'>
          Server Status:{' '}
          {isHealthy ? (
            <span className='font-normal text-green-600'>Healthy</span>
          ) : (
            <span className='font-normal text-destructive'>Unhealthy</span>
          )}
        </p>
      ) : (
        <p className='my-6'>Server Status: ...</p>
      )}
      <div className='space-y-12'>
        <div className='space-y-4'>
          <h1 className='w-fit text-3xl font-bold text-rose-500'>Go Downloader v1.0.0</h1>
          <DownloadForm />
        </div>

        <Progress />
      </div>
    </>
  );
};

export default Home;
