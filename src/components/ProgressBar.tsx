import { Progress } from '@/types';
import { Progress as Prog } from './ui/progress';

type ProgressBarProps = {
  progress: Progress;
  pendingDownloads: number;
};

const ProgressBar = ({ progress, pendingDownloads = 0 }: ProgressBarProps) => {
  return (
    <>
      <p className='font-medium'>Pending: {pendingDownloads}</p>
      <div className='mt-3 space-y-1 rounded-md bg-gray-900 p-2 text-sm'>
        <p>File ID: {progress.file_id}</p>
        <p>Size: {progress.readableSize}</p>
        <p>Speed: {progress.speed} mbps</p>
        <div className='flex items-center justify-center gap-2 pt-1.5'>
          <Prog value={progress.current} className='h-2 w-full' />
          <span className='text-xs text-rose-600'>{progress.current}%</span>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
