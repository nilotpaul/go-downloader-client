import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axiosConfig';
import ReconnectingWebSocket, { CloseEvent, ErrorEvent } from 'reconnecting-websocket';
import { useRef } from 'react';

export const useHealth = () => {
  const queryResult = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/healthcheck');
      return data;
    },
    refetchInterval: 15 * 60000,
    refetchOnWindowFocus: false,
  });

  return { isHealthy: !queryResult.isError, queryResult };
};

export const useWSHealth = () => {
  const queryClient = useQueryClient();
  const sockRef = useRef<ReconnectingWebSocket | null>(null);

  const onOpen = () => {
    console.log('websocket connection established');
  };
  const onMessage = (e: MessageEvent<any>) => {
    if (e.data === 'OK') {
      queryClient.setQueryData(['ws-health'], 'Healthy');
      return;
    }
    const data = JSON.parse(e.data ?? '{}');
    if (data?.errMsg) {
      console.error(data?.errMsg);
      queryClient.setQueryData(['ws-health'], 'Unhealthy');
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
    queryClient.setQueryData(['ws-health'], 'Unhealthy');
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

  const connectToWSHealth = (url: string) => {
    const sock = new ReconnectingWebSocket(url, [], {
      maxRetries: 2,
      minReconnectionDelay: 1500,
    });

    sock.addEventListener('open', onOpen);
    sock.addEventListener('message', onMessage);
    sock.addEventListener('close', onClose);
    sock.addEventListener('error', onError);

    sockRef.current = sock;
  };

  return {
    connectToWSHealth,
    cleanUp,
    sockRef,
  };
};
