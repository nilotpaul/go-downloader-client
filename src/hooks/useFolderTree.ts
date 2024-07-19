import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axiosConfig';
import { FolderTreeNode } from '@/types';

export const useFolderTree = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryResult = useQuery({
    queryKey: ['folder-tree'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/folderTree');
      return data as FolderTreeNode;
    },
  });

  if (queryResult.isSuccess) {
    onSuccess?.();
  }

  return queryResult;
};
