import { getPool } from '../../db';
import type { APIContext } from 'astro';

export async function get(): Promise<Response> {
  const query = {
    text: 'SELECT post_title, post_body FROM posts',
    rowMode: 'array',
  };

  try {
    const posts = await getPool().then((res) => res.query(query));
    return new Response(JSON.stringify(posts.rows), { status: 200 });
  } catch {
    return new Response(null, { status: 404 });
  }
}

export async function post({ request }: APIContext): Promise<Response> {
  let queries: any = {};
  const url = await request.formData();
  for (const query of url) {
    queries = { ...queries, [query[0]]: query[1] };
  }

  if (!Object.hasOwn(queries, 'title') || !Object.hasOwn(queries, 'body')) {
    return Response.redirect('http://localhost:3000/new', 304);
  }

  const query = {
    text: 'INSERT INTO posts(post_title, post_body) VALUES($1, $2) RETURNING *',
    values: [`${queries.title}`, `${queries.body}`],
  };

  try {
    await getPool().then((res) => res.query(query));
    return Response.redirect('http://localhost:3000/', 301);
  } catch {
    return Response.redirect('http://localhost:3000/new', 307);
  }
}
