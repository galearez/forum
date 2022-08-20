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

// this post route isn't supposed to be reached by the user, instead I will use it as a
// method overwrite function for my PUT route, when the request from a HTML form
async function post(request: APIContext) {
  // when working with astro pages we don't have to do this
  // the Astro.url object is equivalent to the following line of code
  const url = new URL(request.request.url);
  //give the value of name, the string arguments must correspond to a url query
  const method = url.searchParams.get('_METHOD');

  if (method !== null && method.toLowerCase() === 'put') {
    return put(request);
  }

  if (method !== null && method.toLowerCase() === 'delete') {
    return _delete(request);
  }

  return Response.redirect('http://localhost:3000/', 303);
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

async function _delete({ params }: APIContext) {
  const query = {
    text: 'DELETE FROM posts WHERE post_id = $1',
    values: [params.id] as string[],
  };

  try {
    await getPool().then((res) => res.query(query));
    return Response.redirect('http://localhost:3000/', 301);
  } catch (error) {
    return new Response('NOT FOUND', { status: 404 });
  }
}

export { get, post, put, _delete as delete };
