const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const url = new URL(request.url);
    const pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    const fallbackUrl = new URL(`${pathname}index.html`, url);
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  },
};

export default worker;
