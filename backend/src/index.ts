import Fastify from 'fastify';
import dotenv from 'dotenv';
import { createDotfilePullRequest } from './github.js';

dotenv.config({ path: '../.env' });

const app = Fastify({ logger: true });

app.get('/health', async () => ({ ok: true, service: 'dotfile-backend' }));

app.post('/api/create-pr', async (request, reply) => {
  try {
    const payload = request.body as Record<string, unknown>;
    const owner = typeof payload.owner === 'string' ? payload.owner.trim() : '';
    const repo = typeof payload.repo === 'string' ? payload.repo.trim() : '';
    const branchName = typeof payload.branchName === 'string' ? payload.branchName.trim() : '';
    const filePath = typeof payload.filePath === 'string' ? payload.filePath.trim() : '';
    const title = typeof payload.title === 'string' ? payload.title.trim() : '';
    const body = typeof payload.body === 'string' ? payload.body.trim() : 'Created by the dotfile composer';
    const fileContents = typeof payload.fileContents === 'string' ? payload.fileContents : '';

    if (!owner || !repo || !branchName || !filePath || !title || !fileContents.trim()) {
      return reply.code(400).send({
        message: 'owner, repo, branchName, filePath, title, and fileContents are required',
      });
    }

    const pullRequest = await createDotfilePullRequest({
      owner,
      repo,
      branchName,
      filePath,
      title,
      body,
      fileContents,
    });

    return {
      ok: true,
      pullRequest,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    request.log.error({ error: message }, 'Failed to create pull request');
    return reply.code(400).send({ message });
  }
});

const start = async () => {
  const port = Number(process.env.PORT || 4000);
  await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`backend listening on http://localhost:${port}`);
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
