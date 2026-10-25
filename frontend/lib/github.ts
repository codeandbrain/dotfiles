export type Repository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
  archived?: boolean;
};

export type Organization = {
  id: number;
  login: string;
  description: string | null;
  avatar_url: string;
  members_url?: string;
};

export type Account = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
};

export const demoAccount: Account = {
  login: 'ariful-demo',
  name: 'Ariful Islam',
  avatar_url: 'https://github.com/github.png',
  bio: 'Health program manager exploring GitHub operations.',
  public_repos: 24,
  followers: 128,
  following: 64,
};

export const demoRepositories: Repository[] = [
  { id: 1, name: 'community-health-dashboard', full_name: 'ariful-demo/community-health-dashboard', private: false, language: 'TypeScript', stargazers_count: 42, forks_count: 8, updated_at: '2026-10-11T10:00:00Z', html_url: 'https://github.com' },
  { id: 2, name: 'field-survey-toolkit', full_name: 'ariful-demo/field-survey-toolkit', private: true, language: 'Python', stargazers_count: 18, forks_count: 3, updated_at: '2026-10-08T10:00:00Z', html_url: 'https://github.com' },
  { id: 3, name: 'district-reporting', full_name: 'ariful-demo/district-reporting', private: false, language: 'Jupyter Notebook', stargazers_count: 12, forks_count: 2, updated_at: '2026-10-02T10:00:00Z', html_url: 'https://github.com' },
  { id: 4, name: 'program-guidelines', full_name: 'ariful-demo/program-guidelines', private: false, language: 'Markdown', stargazers_count: 7, forks_count: 1, updated_at: '2026-09-27T10:00:00Z', html_url: 'https://github.com' },
];

export const demoOrganizations: Organization[] = [
  { id: 11, login: 'health-data-lab', description: 'Open tools for better public health decisions.', avatar_url: 'https://github.com/github.png' },
  { id: 12, login: 'community-programs', description: 'Shared operations and learning resources.', avatar_url: 'https://github.com/github.png' },
];
