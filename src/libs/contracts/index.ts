export type SupportedLanguage = 'javascript' | 'typescript' | 'go' | 'python';

export type SubmissionStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'RUNTIME_ERROR'
  | 'TIME_LIMIT'
  | 'MEMORY_LIMIT'
  | 'COMPILATION_ERROR';

export interface SubmissionCreatedEvent {
  submissionId: string;
  language: SupportedLanguage;
  sourceCode: string;
  input?: string;
}

export interface SubmissionFinishedEvent {
  submissionId: string;
  status: SubmissionStatus;
  stdout: string;
  stderr?: string;
  executionTimeMs: number;
  memoryUsedMb: number;
}
