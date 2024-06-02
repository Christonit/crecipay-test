export interface ContributionI {
  amount: number;
  contribution_year: number;
  funding_source: string;
  status: string;
  submission_date: {
    seconds: number;
    nanoseconds: number;
  };
  user: string;
}
