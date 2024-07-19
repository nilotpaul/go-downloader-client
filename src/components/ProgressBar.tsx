import { Progress } from '@/types';
import { Progress as Prog } from './ui/progress';
import { Button } from './ui/button';
import { useCancelDownload } from '@/hooks/useDownload';

type ProgressBarProps = {
  progress: Progress;
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const cancel = useCancelDownload();

  return (
    <>
      <div className='mt-3 w-full space-y-1.5 rounded-md bg-gray-900 p-2 text-sm'>
        <div className='space-y-1'>
          <p>File ID: {progress.file_id}</p>
          <p>Size: {progress.readableSize}</p>
          <p>Speed: {progress.speed} mbps</p>
          <div className='flex items-center justify-center gap-2 pt-1.5'>
            <Prog value={progress.current} className='h-2 w-full' />
            <span className='text-xs text-rose-600'>{progress.current}%</span>
          </div>
        </div>

        <Button
          disabled={cancel.isPending}
          isLoading={cancel.isPending}
          onClick={() => cancel.mutate({ file_id: progress.file_id, cancelAll: false })}
          size='sm'
          className='w-fit'
          variant='destructive'
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

export default ProgressBar;
