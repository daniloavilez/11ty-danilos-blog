---
title: Service Discovery Notes
date: 2019-01-09
thumbnail_url: https://picsum.photos/id/700/320/240
---

Notes about Service Discovery
<!--more-->

## Why Use Service Discovery

Let’s imagine that you are writing some code that invokes a service that has a REST API. In order to make a request, your code needs to know the network location (IP address and port) of a service instance. In a traditional application running on physical hardware, the network locations of service instances are relatively static. For example, your code can read the network locations from a configuration file that is occasionally updated.

In a modern, cloud‑based microservices application, however, this is a much more difficult problem to solve as shown in the following diagram.

![](https://www.nginx.com/wp-content/uploads/2016/04/Richardson-microservices-part4-1_difficult-service-discovery.png)

Service instances have dynamically assigned network locations. Moreover, the set of service instances changes dynamically because of autoscaling, failures, and upgrades. Consequently, your client code needs to use a more elaborate service discovery mechanism.

There are two main service discovery patterns: `client-side discovery` and `server-side discovery`.

## Client-side Discovery

When using client‑side discovery, the client is responsible for determining the network locations of available service instances and load balancing requests across them. The client queries a service registry, which is a database of available service instances. The client then uses a load‑balancing algorithm to select one of the available service instances and makes a request.

![](https://www.nginx.com/wp-content/uploads/2016/04/Richardson-microservices-part4-2_client-side-pattern.png)

`Netflix OSS` provides a great example of the client‑side discovery pattern. `Netflix Eureka` is a service registry. It provides a REST API for managing service‑instance registration and for querying available instances. `Netflix Ribbon` is an IPC client that works with Eureka to load balance requests across the available service instances.

Since the client knows about the available services instances, it can make intelligent, application‑specific load‑balancing decisions such as using hashing consistently. One significant drawback of this pattern is that it couples the client with the service registry. You must implement client‑side service discovery logic for each programming language and framework used by your service clients.

## Server-side Discovery

![](https://www.nginx.com/wp-content/uploads/2016/04/Richardson-microservices-part4-3_server-side-pattern.png)

The client makes a request to a service via a load balancer. The load balancer queries the service registry and routes each request to an available service instance. As with client‑side discovery, service instances are registered and deregistered with the service registry.

The `AWS Elastic Load Balancer (ELB)` is an example of a server-side discovery router. An ELB is commonly used to load balance external traffic from the Internet. However, you can also use an ELB to load balance traffic that is internal to a virtual private cloud (VPC). A client makes requests (HTTP or TCP) via the ELB using its DNS name. The ELB load balances the traffic among a set of registered Elastic Compute Cloud (EC2) instances or EC2 Container Service (ECS) containers. There isn’t a separate service registry. Instead, EC2 instances and ECS containers are registered with the ELB itself.

The server‑side discovery pattern has several benefits and drawbacks. One great benefit of this pattern is that details of discovery are abstracted away from the client. Clients simply make requests to the load balancer. This eliminates the need to implement discovery logic for each programming language and framework used by your service clients. Also, as mentioned above, some deployment environments provide this functionality for free. This pattern also has some drawbacks, however. Unless the load balancer is provided by the deployment environment, it is yet another highly available system component that you need to set up and manage.

## Service Registry

The `service registry` is a key part of service discovery. It is a database containing the network locations of service instances. A service registry needs to be highly available and up to date. Clients can cache network locations obtained from the service registry. However, that information eventually becomes out of date and clients become unable to discover service instances. Consequently, a service registry consists of a cluster of servers that use a replication protocol to maintain consistency.

As mentioned earlier, `Netflix Eureka` is good example of a service registry. It provides a REST API for registering and querying service instances. A service instance registers its network location using a **POST** request. Every 30 seconds it must refresh its registration using a **PUT** request. A registration is removed by either using an HTTP **DELETE** request or by the instance registration timing out. As you might expect, a client can retrieve the registered service instances by using an HTTP **GET** request.

## References

https://www.nginx.com/blog/service-discovery-in-a-microservices-architecture/