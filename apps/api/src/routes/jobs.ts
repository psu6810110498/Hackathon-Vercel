/**
 * Job status routes — poll job progress
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { getJobStatus } from '../services/queue/worker';

const jobs = new Hono();

jobs.use('*', authMiddleware);

/**
 * GET /jobs/:id — poll job status
 */
jobs.get('/:id', async (c) => {
  const jobId = c.req.param('id');
  const status = await getJobStatus(jobId);

  if (!status) {
    return c.json({ error: 'Job not found' }, 404);
  }

  return c.json(status);
});

export { jobs as jobRoutes };
