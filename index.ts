import { Hono } from 'hono';
import config from './config';
import { serve } from 'bun';
import { serveStatic } from 'hono/bun'

const app = new Hono();

app.get('/metadata', async (c) => {
  const res = await fetch(`${config.metadataServer}?filter=status,name,singer,albumName,lyricLineAllText,duration,progress,playbackRate`);
  const data = await res.json();
  return c.json(data);
});

app.get('/rtc', (c) => {return c.json({rtcServer: config.rtcServer})});

app.use('*', serveStatic({ root: './dist' }));

serve({fetch: app.fetch,port: config.webPort});
