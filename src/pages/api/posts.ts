import { getPool } from '../../db';

export async function get(): Promise<Response> {
  const query = {
    text: 'SELECT post_title, post_body FROM posts',
    rowMode: 'array',
  };

  try {
    const posts = await (await getPool()).query(query);
    return new Response(JSON.stringify(posts.rows), { status: 200 });
  } catch (err) {
    return new Response(null, { status: 404 });
  }
}
