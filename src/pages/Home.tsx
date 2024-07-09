import DownloadForm from '@/components/DownloadForm';
import Progress from '@/components/Progress';

const Home = () => {
  return (
    <div className='space-y-12'>
      <div className='space-y-4'>
        <h1 className='w-fit text-3xl font-bold text-rose-500/80'>Go Downloader v1.0.0</h1>
        <DownloadForm />
      </div>

      <Progress />
    </div>
  );
};

export default Home;
