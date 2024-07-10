import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axiosConfig';
import { toast } from 'sonner';

export const useOAuthCreateSession = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post('/api/v1/signin/google');
      return data;
    },
    onError: (err) => {
      console.error(err);

      if (err instanceof AxiosError) {
        return toast.error(err.response?.data?.errMsg ?? 'something went wrong');
      }
      toast.error('something went wrong');
    },
    onSuccess: (data) => {
      console.log('success');
      window.location.href = data?.url;
    },
  });
};

export const useOAuthClearSession = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post('/api/v1/logout');
      return data;
    },
    onError: (err) => {
      console.error(err);

      if (err instanceof AxiosError) {
        return toast.error(err.response?.data?.errMsg ?? 'something went wrong');
      }
      toast.error('something went wrong');
    },
    onSuccess: () => {
      console.log('success');
      toast.success('session cleared');
    },
  });
};

export const useOAuthRefreshSession = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post('/api/v1/refresh');
      return data;
    },
    onError: (err) => {
      console.error(err);

      if (err instanceof AxiosError) {
        return toast.error(err.response?.data?.errMsg ?? 'something went wrong');
      }
      toast.error('something went wrong');
    },
    onSuccess: () => {
      console.log('success');
      toast.success('session refreshed');
    },
  });
};
