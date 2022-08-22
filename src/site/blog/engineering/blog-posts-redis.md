---
title: Redis Notes
date: 2019-07-16
thumbnail_url: https://picsum.photos/id/220/640/480
---

My notes for Redis database
<!--more-->

## Replication

Redis uses the concept of `master-slave`.

If master is connected to slave it keeps the replica updates by sending a stream of commands and data.

If the link between master and slave is break and the connection is reestablished, it sends from the offset that connection was broke. It calls `Partial Resynchronization`.

If the `Partial Resynchronization` was not possible, slave asks for a `Full Resynchronization` where master will create a snapshot of his all data and send to slave.

Redis uses `asynchronous replication`, which being low latency and high performance, master does not wait for the replicas to process the stream of commands and data.

`Synchronous replication` can be used too using `WAIT` command, `WAIT` is only able to ensure that there are the specified number of ack copies in the other Redis instances.

Redis does not have a configuration with `master-master`, which is the case of multi-DC architecture. But [Dynomite](https://github.com/Netflix/dynomite) can solve this. `Dynomite` supports multi-DC replication and is designed for high-availability.

### How it works

Every Redis master has a replication ID. Also each master takes an offset that increments for every byte of replication stream that it is produced to be sent to replicas. The replication offset is incremented even if no replica is actually connected.

```bash
Replication ID, offset
```

When replicas connect to master, replicas send their old master replication ID and the offsets they processed so far. This way master can send just the incremental part needed. If master does not recognize the replication ID, it will send all the data doing a `Full Resynchronization`.

### Configuration

To configure Redis replication is just add the following line to the replica configuration file:

```bash
replicaof 192.168.1.1 6379
```

The IP 192.168.1.1 is reference to master IP address.

### Redirection and resharding

#### MOVED Redirection

Redis client is free to send queries to every node in the cluster, including slave nodes. The node will analyze the query, it will lookup what node is responsible for the hash slot where the key or keys (in case o multiple keys) belong.

```bash
GET x
-MOVED 3999 127.0.0.1:6381
```

## High Availability

### Redis Sentinel

Redis Sentinel provides HA for Redis.

Redis Sentinel provides other collateral tasks such as monitoring, notifications and acts as a configuration provider for clients.

- Monitoring: Sentinel constantly checks if your master and replica instances are working as expected.
- Notification: Sentinel can notify system administrator.
- Automatic Failover: If a master is not working as expected, Sentinel can start a failover process where a replica is promoted to master.
- Configuration Provider: Sentinel acts as a source of authority for clients service discovery. Clients connect to sentinels in order to ask for the address of the current Redis master responsible for a given service.

## References

[Redis Sentinel Cluster - K8S](https://docs.bitnami.com/tutorials/deploy-redis-sentinel-production-cluster/)
