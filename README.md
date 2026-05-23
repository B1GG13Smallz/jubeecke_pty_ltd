# JUBEECKE PTY LTD Website

Premium one-page Angular website for JUBEECKE PTY LTD diesel refilling, mobile fuel supply, and diesel bowser rental services.

## Local Development

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Production Build

```bash
npm run build
```

The compiled Angular site is generated in `dist/jubeecke-site/browser`.

## Docker

Build and run locally:

```bash
docker build -t jubeecke-site .
docker run --rm -p 8080:8080 -e PORT=8080 jubeecke-site
```

Open `http://localhost:8080`.

## Render Deployment

This repo includes:

- `Dockerfile`
- `nginx.conf.template`
- `render.yaml`

On Render, create a Web Service from this GitHub repo and select Docker, or deploy from the included Blueprint. The container serves the Angular build with Nginx and binds to Render's `PORT` environment variable.
