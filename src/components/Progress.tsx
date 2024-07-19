import { useCancelDownload, useProgress } from '@/hooks/useDownload';
import { type Progress } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from './ui/separator';
import ProgressBar from './ProgressBar';
import { Button } from './ui/button';

const Progress = () => {
  const initialProgress = useProgress({
    onError: (res) => {
      if (res?.status !== 404) {
        toast.error(res?.data?.errMsg ?? 'something went wrong');
      }
    },
  });
  const cancelAll = useCancelDownload();

  const { data: progress } = useQuery<Progress[]>({
    queryKey: ['ws-progress'],
  });
  const { data: info } = useQuery<string>({
    queryKey: ['ws-progress-info'],
  });

  return (
    <div className='max-w-2xl'>
      <h2 className='mb-4 w-fit text-3xl font-bold'>
        Downloads
        <Separator className='mt-1 h-[2px] w-1/2 bg-violet-600/80' />
      </h2>

      {!initialProgress.data?.length && !progress?.length && info?.length !== 0 && (
        <p className='my-3 text-sm capitalize text-blue-500'>{info}</p>
      )}
      {!!progress && progress?.length !== 0 && (
        <>
          <p className='font-medium'>Pending: {initialProgress.data?.length || progress?.length}</p>
          <Button
            disabled={cancelAll.isPending}
            isLoading={cancelAll.isPending}
            onClick={() => cancelAll.mutate({ cancelAll: true })}
            type='button'
            variant='destructive'
            className='my-3'
          >
            Cancel All
          </Button>

          {progress
            ?.sort((a, b) => a.total - b.total)
            .map((prog) => <ProgressBar key={prog.file_id} progress={prog} />)}
        </>
      )}
      {initialProgress.isPending && <Loader2 className='h-5 w-5 animate-spin' />}
    </div>
  );
};

export default Progress;
