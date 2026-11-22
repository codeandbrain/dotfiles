# Product brief — Orbit

## The problem

Managing repositories across a personal GitHub account and several organizations normally means jumping between GitHub pages, losing track of what you can access, and hand-writing CSVs or commands for simple batch tasks. That is difficult for people who do not work in code every day.

## The answer

A single, free, browser-based workspace that shows the whole picture at a glance, works immediately in demo mode, and connects securely to a real GitHub account when the user is ready.

## Who it is for

- A sole builder or program manager who is excellent at their domain but does not read or write code.
- Someone who needs clear buttons, plain-language messages, and copy-paste instructions.
- Someone with a slow or intermittent internet connection — the interface therefore loads no fonts or assets from outside services.

## What is included now

| Area | Included |
| --- | --- |
| Overview | Repository, organization, follower, and archived counts; recent repositories |
| Repositories | Search, organization chips, language/visibility/archived filters, sorting, multi-select, CSV export, copy links |
| Organizations | Cards with accessible repository counts |
| Access & teams | Honest demo data; a clear note that live team data is not read |
| Activity | Sample log and CSV export in demo mode; clear note for live accounts |
| Settings | GitHub sign-in, sign-out, demo mode, and visible status messages |

## What is deliberately not included

- Browser-stored tokens or pasted personal access tokens
- Branch, commit, pull-request, or merge operations
- Activity and team APIs
- A database, user profiles, job queues, or scheduled work
- Paid services or tools with expiring free trials

## Guiding decisions

1. **Safety before convenience:** write actions require an explicit confirmation, and demo mode is read-only.
2. **One product, one path:** one install command, one settings file, one hosting target.
3. **Honest empty states:** if a live feature does not exist, say so rather than showing sample data as if it were real.
4. **Zero cost:** only free tools with permanent free tiers.
5. **Portable:** open standards, exportable data, no vendor lock-in.

## Next ideas (not promises)

- Live activity and organization membership through server routes
- Saved filter views
- A guided "first hour with GitHub" walkthrough inside the app
