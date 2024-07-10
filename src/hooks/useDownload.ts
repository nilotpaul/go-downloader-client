import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '@/lib/axiosConfig';
import { toast } from 'sonner';
import ReconnectingWebSocket, { CloseEvent, ErrorEvent } from 'reconnecting-websocket';
import { wait } from '@/lib/utils';
import { Progress } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DownloadSchema, downloadSchema } from '@/validations/download';
import { useEffect, useRef } from 'react';

export const useDownload = ({
  onSettled,
}: {
  onSettled?: (data?: { status: number; file_ids: string[] }) => void | Promise<void>;
} = {}) => {
  const form = useForm<DownloadSchema>({
    resolver: zodResolver(downloadSchema),
    defaultValues: {
      links: '',
      path: undefined,
    },
  });

  const mutationResult = useMutation({
    mutationFn: async (payload: DownloadSchema) => {
      const { data } = await axios.post<{ status: number; file_ids: string[] }>(
        '/api/v1/download',
        payload
      );
      return data;
    },
    onSuccess: async (data) => {
      console.log('download started: ', data?.file_ids);

      wait(1500);
      form.reset();
      toast.success(`${data?.file_ids?.length} download(s) started`);
    },
    onError: (err) => {
      console.error(err);

      if (err instanceof AxiosError) {
        return toast.error(err.response?.data?.errMsg ?? 'something went wrong');
      }
      toast.error('something went wrong');
    },
    onSettled: async (data) => {
      if (onSettled) {
        await onSettled(data);
      }
    },
  });

  return [form, mutationResult] as const;
};

export const useWSProgress = ({
  onWSInfo,
  onWSError,
}: {
  onWSInfo?: (info: string) => void;
  onWSError?: (err: string) => void;
} = {}) => {
  const queryClient = useQueryClient();
  const sockRef = useRef<ReconnectingWebSocket | null>(null);

  const onOpen = () => {
    console.log('websocket connection established');
  };
  const onMessage = (e: MessageEvent<any>) => {
    const data = JSON.parse(e.data ?? '{}');
    if (data?.errMsg) {
      queryClient.setQueryData(['ws-progress-error'], data?.errMsg);
      onWSError?.(data?.errMsg);
      sockRef.current?.close();
      return;
    }
    if (data?.infoMsg) {
      queryClient.setQueryData(['ws-progress-info'], data?.infoMsg);
      onWSInfo?.(data?.infoMsg);
      return;
    }
    if (data?.length !== 0) {
      console.info(data);
      queryClient.setQueryData(['ws-progress'], data);
      return;
    }
  };
  const onClose = (e: CloseEvent) => {
    if (e.wasClean) {
      console.log(`websocket connection closed cleanly, code=${e.code} reason=${e.reason}`);
    } else {
      console.error('websocket connection died');
    }
  };
  const onError = (e: ErrorEvent) => {
    console.log('websocket connection error: ', e);
  };
  const cleanUp = () => {
    if (sockRef.current) {
      const sock = sockRef.current;

      sock.removeEventListener('open', onOpen);
      sock.removeEventListener('message', onMessage);
      sock.removeEventListener('close', onClose);
      sock.removeEventListener('error', onError);
      sock.close();

      sockRef.current = null;
    }
  };

  const connectToWSProgress = (url: string) => {
    const sock = new ReconnectingWebSocket(url, [], {
      maxRetries: 3,
      minReconnectionDelay: 1500,
    });

    sock.addEventListener('open', onOpen);
    sock.addEventListener('message', onMessage);
    sock.addEventListener('close', onClose);
    sock.addEventListener('error', onError);

    sockRef.current = sock;
  };

  return {
    connectToWSProgress,
    cleanUp,
    sockRef,
  };
};

export const useProgress = ({
  onError,
}: {
  onError?: (res: AxiosResponse<any, any> | undefined) => void;
} = {}) => {
  const queryClient = useQueryClient();
  const ws = useWSProgress();
  const queryResult = useQuery<Progress[]>({
    queryKey: ['progress'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/progress');
      return data;
    },
    retry: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!!queryResult.data && queryResult.data?.length !== 0) {
      console.log(queryResult.data);
      queryClient.setQueryData(['ws-progress'], queryResult.data);
      ws.connectToWSProgress('/api/v1/ws/progress');
    }

    return () => {
      ws.cleanUp();
    };
  }, [queryResult.data]);

  if (
    queryResult.isError &&
    queryResult.error instanceof AxiosError &&
    queryResult.error.response?.status === 404
  ) {
    const res = queryResult.error.response;
    queryClient.setQueryData(['ws-progress-info'], res?.data?.errMsg);
  }
  if (queryResult.isError && queryResult.error instanceof AxiosError) {
    const res = queryResult.error.response;
    onError?.(res);
  }

  return queryResult;
};
