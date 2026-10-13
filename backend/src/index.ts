import Fastify from 'fastify';
import dotenv from 'dotenv';
import { createDotfilePullRequest } from './github.js';

dotenv.config({ path: '../.env' });

const app = Fastify({ logger: true });

app.get('/health', async () => ({ ok: true, service: 'dotfile-backend' }));

app.post('/api/create-pr', async (request, reply) => {
  try {
    const {
      owner,
      repo,
      branchName,
      filePath,
      title,
      body,
      fileContents,
    } = request.body as {
      owner?: string;
      repo?: string;
      branchName?: string;
      filePath?: string;
      title?: string;
      body?: string;
      fileContents?: string;
    };

    if (!owner || !repo || !branchName || !filePath || !title || !fileContents) {
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
      body: body || 'Created by the dotfile composer',
      fileContents,
    });

    return {
      ok: true,
      pullRequest,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    request.log.error({ error: message }, 'Failed to create pull request');
    return reply.code(500).send({ message });
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
