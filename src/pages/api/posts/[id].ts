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

async function put({ params, request }: APIContext) {
  const body = await request.formData();
  let urlQueries: any = {};
  for (const query of body) {
    urlQueries = { ...urlQueries, [query[0]]: query[1] };
  }

  if (
    !Object.hasOwn(urlQueries, 'title') ||
    !Object.hasOwn(urlQueries, 'body')
  ) {
    return Response.redirect('http://localhost:3000/new', 304);
  }

  if (!Object.hasOwn(urlQueries, 'id') && urlQueries.id !== params.id) {
    return Response.redirect('http://localhost:3000/new', 304);
  }

  const query = {
    text: 'UPDATE posts SET post_title = $2, post_body = $3 WHERE post_id = $1',
    values: [params.id, urlQueries.title, urlQueries.body] as string[],
  };

  try {
    const res = await getPool().then((res) => res.query(query));
    return Response.redirect(`http://localhost:3000/p/${params.id}`, 301);
  } catch {
    return new Response('CANNOT UPDATE', { status: 500 });
  }
}

export { get, put };
