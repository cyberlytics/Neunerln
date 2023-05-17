interface Issues {
  id: string;
  issue: string;
}

interface ErrorSpec {
  name: string;
  message: string;
  log_level: string;
  http_status_codes: number[];
  issues?: Issues[];
  suggested_application_actions: string[];
}

export interface ErrorSpecs extends Array<{ error_spec: ErrorSpec }> {}

export interface SerializeErrors {
  errors: ErrorSpecs;
}
