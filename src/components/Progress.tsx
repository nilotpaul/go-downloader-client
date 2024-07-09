import { useProgress } from '@/hooks/useDownload';
import { type Progress } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from './ui/separator';
import ProgressBar from './ProgressBar';

const Progress = () => {
  const initialProgress = useProgress();

  const { data: progress } = useQuery<Progress[]>({
    queryKey: ['ws-progress'],
  });
  const { data: info } = useQuery<string>({
    queryKey: ['ws-progress-info'],
  });
  const { data: err } = useQuery<string>({
    queryKey: ['ws-progress-error'],
  });

  if (
    initialProgress.isError &&
    initialProgress.error instanceof AxiosError &&
    initialProgress.error.response?.status !== 404
  ) {
    const res = initialProgress.error.response;
    toast.error(res?.data?.errMsg ?? 'something went wrong');
  }
  if (!!err && err?.length !== 0) {
    toast.error(err);
  }

  return (
    <div className='max-w-2xl'>
      <h2 className='mb-4 w-fit text-3xl font-bold'>
        Downloads
        <Separator className='mt-1 h-[2px] w-1/2 bg-violet-600/80' />
      </h2>

      {!initialProgress.data?.length && !progress?.length && info?.length !== 0 && (
        <p className='text-sm text-blue-500'>{info}</p>
      )}
      {progress?.length !== 0 &&
        progress?.map((prog) => (
          <ProgressBar
            key={prog.file_id}
            pendingDownloads={initialProgress.data?.length ?? progress.length}
            progress={prog}
          />
        ))}

      {initialProgress.isPending && <Loader2 className='h-5 w-5 animate-spin' />}
    </div>
  );
};

export default Progress;
