---
title: CKAD Notes
date: 2020-02-27
private: true
---

My notes for CKAD Exam
<!--more-->

## Curriculum

- Core Concepts - 13%
- Multi-Container Pods - 10%
- Services & Networking - 13%
- Pod Design - 20%
- Configuration - 18%
- Observability - 18%
- State Persistence - 8%

## Exam Environment

Tools to need to be familiar with to get succeeded:

- YAML
- Vim
- Bash

- Use K8S documentation is allowed. [Kubernetes IO Docs](https://kubernetes.io/docs/home/)
- Kubernetes Cheatsheet
- Kubernetes API

`kubectl get ns` - Usage of `ns` instead of `namespaces`

`kubectl describe pvc claim` - Usage of `pvc` instead of `persistentvolumeclaim`

### Deleting K8S Objects

`$ kubectl delete pod nginx --grace-period=0 --force`

### Finding Object Information

Filter configuration. Grep is great here!

`$ kubectl get pods -o yaml | grep -C 5 labels:`

### Using an Alias for kubectl

```bash
$ alias k=kubectl
$ k version
```

## Sample Exam

### Pods

Create a namespace ckad-ns1. In this namespace, run the following pods:

- A pod with the name pod-a, running the httpd server image

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-a
  namespace: ckad-ns1
spec:
  containers:
  - name: httpd-q1-ckad
    image: httpd
```

- A pod with the name pod-b, running the nginx server image as well as the rsyslog image

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-b
  namespace: ckad-ns1
spec:
  containers:
  - name: nginx-q2-ckad
    image: nginx
  - name: rsyslog-q2-ckad
    image: rsyslog/syslog_appliance_alpine
```

### Finding pods

Which command would you use to find all Deployments that have the label 'app' set to 'nginx'

A.: `kubectl get deployments.apps --selector app=nginx`

### ConfigMaps

In the ckad-ns2 Namespace, run a Pod with the name alpine-pod. This Pod should run a container based on the alpine image. In this container, two variables must be set:

- 'localport' is set to 'localhost:8082'
- 'external_url' is set to 'linux.com'

```bash
$ k create namespace ckad-ns2
namespace/ckad-ns2 created
```

```yaml
apiVersion: v1
data:
  external_url: linux.com
  localport: localhost:8082
kind: ConfigMap
metadata:
  creationTimestamp: null
  name: alpine-config
  namespace: ckad-ns2
---
apiVersion: v1
kind: Pod
metadata:
  name: configmap-ckad-pod
  namespace: ckad-ns2
spec:
  containers:
    - name: demo
      image: alpine
      command: ["sleep", "3600"]
      envFrom: # To simplify I used the `envFrom`
      - configMapRef:
          name: alpine-config
      #env:
        # Define the environment variable
        #- name: localport  # Notice that the case is different here
                           # from the key name in the ConfigMap.
        #  valueFrom:
        #    configMapKeyRef:
        #      name: alpine-config # The ConfigMap this value comes from.
        #      key: localport # The key to fetch.
        #- name: external_url
        #  valueFrom:
        #    configMapKeyRef:
        #      name: alpine-config
        #      key: external_url
```

### Sidecars

Create a multi-container pod with the name sidecar_pod, that runs in the ckad-ns3 namespace.

- The primary container is running BusyBox, and writes the output of the date command to the /var/log/date.log file every 5 seconds.
- The second container should run as a sidecar and provide access to this file, using an hostpath shared volume.

```bash
$ kubectl create ns ckad-ns3
namespace/ckad-ns3 created
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-pod
  namespace: ckad-ns3
spec:
  containers:
  - name: busybox
    image: busybox
    args:
      - /bin/sh
      - -c
      - >
        while true;
        do
          echo "$(date)" >> /var/log/date.log;
          sleep 5;
        done
    volumeMounts:
    - name: varlog
      mountPath: /var/log
  - name: sidecar-log
    image: busybox
    args: [/bin/sh, -c, 'tail -f /var/log/date.log']
    volumeMounts:
    - name: varlog
      mountPath: /var/log
  volumes:
  - name: varlog
    emptyDir: {}
```

### Inspecting containers

The pod my-server is running 3 containers: file-server, log-server and db-server. When starting it, the log-server fails. Which command should you use to analyze why it is going wrong?

`kubectl logs my-server log-server`


### Using probes

Create a pod that runs the httpd webserver

- The webserver should be offering its services on port 80, and ckad-ns3 namespace
- This pod should use a readiness probe with an initial delay of 60 seconds.
- The probe should check the availability of the webserver document root (path /), before start and during operation as well
- Each probes should get 60 seconds before it is initialized

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: liveness-exec
  namespace: ckad-ns3
spec:
  containers:
  - name: liveness
    image: httpd
    ports:
    - containerPort: 80
    readinessProbe:
      initialDelaySeconds: 60
      periodSeconds: 60
      exec:
        command: [ "ls", "/" ]
```

### Creating a deployment

Write a manifest file with the name nginx-exam.yaml, that meets the following requirements:

- It starts 5 replicas that run the nginx:1.8 image
- Each Pod has the label app=webshop
- Create the Deployment such that the existing Pods are terminated before new Pods are created to replace them
- The Deployment itself should use the label service=nginx

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: webshop
    service: nginx
spec:
  replicas: 5
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: webshop
  template:
    metadata:
      labels:
        app: webshop
    spec:
      containers:
      - name: nginx
        image: nginx:1.8
```

### Exposing services

In the ckad-ns6 namespace, create a Deployment that runs the nginx 1.8 image and give it the name nginx-deployment

- Ensure it runs 3 replicas
- After verifying that the Deployment runs successfully, expose it such that users that are external to the cluster can reach it, using the Kubernetes Service object.

```bash
$ k create namespace ckad-ns6
namespace/ckad-ns6 created
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: webshop
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webshop
  template:
    metadata:
      labels:
        app: webshop
    spec:
      containers:
      - name: nginx
        image: nginx:1.8
```

```bash
$ k expose deployment nginx-deployment --port=80
service/nginx-deployment exposed
```

### Using Network Policies

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nw-db
  namespace: ckad-ns6
  labels:
    role: db
spec:
  containers:
  - name: busy
    image: busybox
    args:
      - /bin/sh
      - -c
      - sleep 3600
---
apiVersion: v1
kind: Pod
metadata:
  name: pod-nw-webserver
  namespace: ckad-ns6
  labels:
    role: webserver
spec:
  containers:
  - name: busy
    image: busybox
    args:
      - /bin/sh
      - -c
      - sleep 3600
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-network-policy
  namespace: ckad-ns6
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: webserver
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ws-network-policy
  namespace: ckad-ns6
spec:
  podSelector:
    matchLabels:
      role: webserver
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - {}
  egress:
  - {}
```

### Using Storage

```bash
$ k create ns ckad-1311
namespace/ckad-1311 created
```

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: 1311-pv
  namespace: ckad-1311
spec:
  capacity:
    storage: 2Gi
  accessModes:
    - ReadWriteMany
  hostPath:
    path: "/tmp"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: 1311-pvc
  namespace: ckad-1311
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: 1311-pod
  namespace: ckad-1311
spec:
  containers:
  - name: nginx
    image: nginx
    volumeMounts:
      - mountPath: "/webdata"
        name: data
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: 1311-pvc
```