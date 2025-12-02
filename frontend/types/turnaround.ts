// Each numeric row
export interface RowType {
  label: string;
  value: number | null;
}

// Entry returned from backend
export interface TurnAroundExecutionEntry {
  id: number;
  entryDate: string;

  clientId: number;
  siteId: number;
  jobId: number;

  client: { id: number; clientName: string };
  site: { id: number; siteName: string };
  job: { id: number; jobName: string };

  directEarned: RowType[];
  percentComplete: RowType[];
}

// Response from GET all entries API
export interface TurnAroundExecutionListResponse {
  entries: TurnAroundExecutionEntry[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
