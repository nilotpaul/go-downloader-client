export type Progress = {
  readableSize: string;
  current: number;
  speed: number;
  complete: boolean;
  startTime: Date;
  endTime: Date;
  file_id: string;
  total: number;
};

export type FolderTreeNode = {
  path: string;
  name: string;
  children?: FolderTreeNode[];
};
