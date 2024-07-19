import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { FolderTreeNode } from '@/types';
import { useFolderTree } from '@/hooks/useFolderTree';
import { FolderPen } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { DownloadSchema } from '@/validations/download';

type FolderTreeProps = {
  children: React.ReactNode;
  setValue: UseFormSetValue<DownloadSchema>;
};

const FolderTree = ({ children, setValue }: FolderTreeProps) => {
  const query = useFolderTree();
  const [breadcrumb, setBreadcrumb] = useState<FolderTreeNode[]>([]);
  const [folderData, setFolderData] = useState<FolderTreeNode>({
    path: '.',
    name: '.',
    children: [],
  });

  useEffect(() => {
    if (!query.isPending && query.data) {
      setFolderData(query.data);
      setBreadcrumb([query.data]);
    }
  }, [query.isPending, query.data]);

  const handleClickPath = (node: FolderTreeNode) => {
    setBreadcrumb((prev) => {
      const index = prev.findIndex((item) => item.path === node.path);
      if (index !== -1) {
        return prev.slice(0, index + 1);
      } else {
        return [...prev, node];
      }
    });
    setFolderData(node);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    setFolderData(newBreadcrumb[index]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className='sr-only'>
          <DialogTitle>Folder Tree</DialogTitle>
        </DialogHeader>
        <div className='line-clamp-1 space-x-1 text-sm font-semibold text-green-600'>
          {breadcrumb.map((node, idx) => (
            <span
              key={node.path}
              onClick={() => handleBreadcrumbClick(idx)}
              className='cursor-pointer'
            >
              {idx !== 0 && '>'} {node.name === '.' ? 'root' : node.name}
            </span>
          ))}
        </div>

        <div className='flex flex-col gap-y-1.5'>
          {folderData.children && folderData.children.length > 0 ? (
            folderData.children.map((item) => (
              <div key={item.path} className='flex items-center justify-between'>
                <p onClick={() => handleClickPath(item)} className='line-clamp-1 cursor-pointer'>
                  - {item.name}
                </p>
                <FolderPen
                  onClick={() => setValue('path', item.path)}
                  className='h-4 w-4 cursor-pointer text-destructive'
                />
              </div>
            ))
          ) : (
            <span className='text-sm'>No subfolders here</span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FolderTree;
