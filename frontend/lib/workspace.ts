import type { Repository } from './github';

export type RepositoryFilters = {
  query: string;
  organizations: string[];
  visibility: 'all' | 'public' | 'private';
  language: string;
  includeArchived: boolean;
  sort: 'updated' | 'name' | 'stars';
};

export function repositoryOrganization(repo: Repository) {
  return repo.full_name.split('/')[0] || 'personal';
}

export function filterRepositories(repositories: Repository[], filters: RepositoryFilters) {
  const query = filters.query.trim().toLowerCase();
  const selectedOrganizations = new Set(filters.organizations);
  return repositories
    .filter((repo) => {
      const organization = repositoryOrganization(repo);
      const matchesQuery = !query || `${repo.name} ${repo.full_name} ${repo.language ?? ''}`.toLowerCase().includes(query);
      const matchesOrganization = selectedOrganizations.size === 0 || selectedOrganizations.has(organization);
      const matchesVisibility = filters.visibility === 'all' || (filters.visibility === 'private' ? repo.private : !repo.private);
      const matchesLanguage = !filters.language || (repo.language ?? 'No language') === filters.language;
      const matchesArchived = filters.includeArchived || !repo.archived;
      return matchesQuery && matchesOrganization && matchesVisibility && matchesLanguage && matchesArchived;
    })
    .sort((a, b) => {
      if (filters.sort === 'name') return a.name.localeCompare(b.name);
      if (filters.sort === 'stars') return b.stargazers_count - a.stargazers_count;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
}

export function repositoryOwnerAndName(repo: Repository) {
  const [owner, ...nameParts] = repo.full_name.split('/');
  return { owner, name: nameParts.join('/') || repo.name };
}

export function repositoriesToCsv(repositories: Repository[]) {
  const header = ['repository', 'organization', 'visibility', 'language', 'stars', 'updated'];
  const rows = repositories.map((repo) => [repo.name, repositoryOrganization(repo), repo.private ? 'private' : 'public', repo.language ?? '', String(repo.stargazers_count), repo.updated_at]);
  return [header, ...rows].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n');
}

export function activitiesToCsv(activities: Array<{ title: string; detail: string; time: string }>) {
  const rows = activities.map((item) => [item.title, item.detail, item.time]);
  return [['activity', 'detail', 'time'], ...rows]
    .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(','))
    .join('\n');
}
