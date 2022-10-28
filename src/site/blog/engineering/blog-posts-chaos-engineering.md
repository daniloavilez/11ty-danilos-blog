---
title: Chaos Engineering Notes
date: 2019-05-17
thumbnail_url: https://picsum.photos/id/200/320/240
---

My notes for Chaos Engineering
<!--more-->

## Using Docker and Gremlin

### Installing Docker (OpenSUSE)

Install docker and docker-compose

`zypper install docker docker-compose`

Start docker daemon, docker daemon will be started during booting

`sudo systemctl enable docker`

Join docker group in order to use the docker daemon

`sudo usermod -G docker -a YOURUSERNAME`

Now 'Log out' and 'Log in' again. Ok, we're done so far!! :)

### Creating an htop container

Now we're going to create a htop container, this container will serve as a resource observable of others containers.

Let's create a `Dockerfile`

`vi Dockerfile`

Add this content

```bash
FROM alpine:latest
RUN apk add --update htop && rm -rf /var/cache/apk/*
ENTRYPOINT ["htop"]
```

We're going to build our new htop container

`sudo docker build -t htop .`

If you want to test this container, we can run this command below:

`docker run -it --rm --pid=host htop`

### Creating an Nginx container

We're going to create a directory and inside it, we will add our fake web site

```shell
mkdir -p nginx/html
cd nginx/html
```

Inside the dir, add the file `index.html`, put the example below:

```html
<html>
  <head>
    <title>Docker nginx tutorial</title>
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
      crossorigin="anonymous"
    />
  </head>
  <body>
    <div class="container">
      <h1>Hello this is your container speaking.</h1>
      <p>This page was created by your Docker container.</p>
      <p>Now it’s time to create a Gremlin attack.</p>
    </div>
  </body>
</html>
```

Run the command, this will create a container `nginx`

`sudo docker run -l service=nginx --name docker-nginx -p 80:80 -d -v /docker-nginx/html:/usr/share/nginx/html nginx`

### Monitoring nginx container

Now it's time to use our htop container to monitoring our nginx container

`docker run -it --rm --pid=container:docker-nginx htop`

