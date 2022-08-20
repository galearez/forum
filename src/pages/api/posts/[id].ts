import type { APIContext } from 'astro';
import { getPool } from '../../../db';

async function get({ params }: APIContext) {
  const query = {
    text: 'SELECT * FROM posts WHERE post_id = $1',
    values: [params.id] as string[],
  };

  try {
    const res = await getPool().then((res) => res.query(query));
    return new Response(JSON.stringify(res.rows[0]), { status: 200 });
  } catch {
    return new Response('NOT FOUND', { status: 404 });
  }
}

export { get };
