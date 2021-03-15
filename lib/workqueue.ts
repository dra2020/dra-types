export type WorkQueueFailure = 'hard' | 'soft';

export interface WorkQueueItem
{
  id: string,
  functionName: string,
  params: any,
  priority: number,
  failType?: WorkQueueFailure,
}
