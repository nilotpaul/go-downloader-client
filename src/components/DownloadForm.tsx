import { useDownload, useWSProgress } from '@/hooks/useDownload';
import { useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DownloadForm = () => {
  const ws = useWSProgress({
    onWSError: (msg) => {
      if (msg.length !== 0) {
        return toast.error(msg);
      }
    },
  });
  const [form, download] = useDownload({
    onSettled: (data) => {
      if (!!data?.file_ids && data?.file_ids.length > 0) {
        ws.connectToWSProgress('/api/v1/ws/progress');
      }
    },
  });

  useEffect(() => {
    return () => {
      ws.cleanUp();
    };
  }, []);

  return (
    <form onSubmit={form.handleSubmit((v) => download.mutate(v))}>
      <Textarea
        {...form.register('links')}
        placeholder='Paste link(s) here. For multiple, seperate with comma.'
        className='mb-1 min-h-[200px] max-w-2xl'
      />
      <span className='ml-2 text-sm text-destructive'>{form.formState.errors.links?.message}</span>

      <div className='mt-4 space-y-2'>
        <Label className='ml-1'>Destination Path</Label>
        <Input
          {...form.register('path')}
          className='mb-1 max-w-2xl'
          type='text'
          placeholder='Eg: ./media/Sex Education'
        />
        <span className='ml-2 text-sm text-destructive'>{form.formState.errors.path?.message}</span>
      </div>

      <div className='mt-6 space-x-4'>
        <Button className='gap-2' disabled={download.isPending} type='submit'>
          Start Download
          {download.isPending && <Loader2 className='h-4 w-4 animate-spin' />}
        </Button>
        <Button type='button' variant='destructive'>
          Cancel All
        </Button>
      </div>
    </form>
  );
};

export default DownloadForm;
