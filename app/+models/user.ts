export interface User {
  id: number;
  login: string;
  full_name: string;
  description: string;
  url: string;
  events_url: string;
  avatar_url: string;
  repos_url: string;
  is_organization: boolean;
}

// Note: fields full_name & description are null for a contributor (absent from the github response)
// TODO: Resolve regular user to get these fields initialized
export interface Contributor extends User {
  contributions: number;
  $selected?: boolean;
}