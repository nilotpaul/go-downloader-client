import { useDownload, useWSProgress } from '@/hooks/useDownload';
import { useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { FolderTreeIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import FolderTree from './FolderTree';

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
    <form className='max-w-2xl' onSubmit={form.handleSubmit((v) => download.mutate(v))}>
      <Textarea
        {...form.register('links')}
        placeholder='Paste link(s) here. For multiple, seperate with comma.'
        className='mb-1 min-h-[200px]'
      />
      <span className='ml-2 text-sm text-destructive'>{form.formState.errors.links?.message}</span>

      <div className='mt-4 space-y-2'>
        <Label className='ml-1'>Destination Path</Label>
        <div className='relative'>
          <Input
            {...form.register('path')}
            className='mb-1 pr-10' // Add padding to the right to avoid text overlap
            type='text'
            placeholder='Eg: ./media/Sex Education'
          />
          <FolderTree setValue={form.setValue}>
            <FolderTreeIcon className='absolute right-4 top-1/2 mt-px h-4 w-4 -translate-y-1/2 transform cursor-pointer' />
          </FolderTree>
        </div>
        <span className='ml-2 text-sm text-destructive'>{form.formState.errors.path?.message}</span>
      </div>

      <Button className='mt-4 gap-2' disabled={download.isPending} type='submit'>
        Start Download
        {download.isPending && <Loader2 className='h-4 w-4 animate-spin' />}
      </Button>
    </form>
  );
};

export default DownloadForm;
