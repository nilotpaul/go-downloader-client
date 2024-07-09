export type Progress = {
  readableSize: string;
  current: number;
  speed: number;
  complete: boolean;
  startTime: number;
  endTime: number;
  file_id: string;
};
