---
title: Kubernetes Notes
date: 2019-07-16
thumbnail_url: https://picsum.photos/id/211/320/240
---

My notes for K8S
<!--more-->

## How kubernetes provisioning an VM (minikube)?

Kubernetes uses `libmachine` to provision an VM, and `kubeadm` install a Kubernetes cluster.

Inside of this VM created, there are Kubernetes cluster and Docker daemon. Docker is used to pull new images from Docker Registry.

## Install and Set up Kubectl and Minikube

To check if virtualization is supported on Linux, run the following command and verify that the output is non-empty:

`egrep --color 'vmx|svm' /proc/cpuinfo`

[Install Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)

[Installing Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)

## Basic Commands

Start minikube (Cluster)

`minikube start`

Create a deployment

`kubectl create hello-minikube --image=gcr.io/google_containers/echoserver:1.4 --port=8080`

Expose deployment as a service

`kubectl expose deployment hello-minikube --type=NodePort`

Visualizar Pods

`kubectl get pod`

Access Service

`curl $(minikube service hello-minikube --url)`

Delete Deployment previously created

`kubectl delete deployment hello-minikube`

Stop minikube

`minikube stop`

Scale Up

`kubectl scale --replicas=4 deployment tomcat-deployment`

Scale Down

`kubectl scale --replicas=3 deployment tomcat-deployment`

Expose a Load Balancer for these replicas

`kubectl expose deployment tomcat-deployment --type=LoadBalancer --port=8080 --target-port=8080 --name=tomcat-load-balancer`

Desbribe the IPs of this load balancer

`kubectl describe services tomcat-load-balancer`

Check rollout status

`kubectl rollout status deployment tomcat-deployment`

See rollout history

`kubectl rollout history deployment/tomcat-deployment`

See revision of our deployment

`kubectl rollout history deployment/tomcat-deployment --revision=2`

Label nodes

`kubectl label node minikube storageType=ssd`

Check label after labeled it (search for Labels)

`kubectl describe node minikube`

Check services available

`kubectl get svc`

Check persistent volumes available

`kubectl get persistentvolumes`

### Auto-Scaling

`kubectl autoscale deployment wordpress --cpu-percent=50 --min=1 --max=5`

Simulate over loading on containers

`kubectl run -i --tty load-generator --image=busybox /bin/sh`

[What is BusyBox?](https://en.wikipedia.org/wiki/BusyBox)

## Service

### Headless Service

> Each connection to the service is forwarded to one randomly selected backing pod. But what if the client needs to connect to all of those pods? What if the backing pods themselves need to each connect to all the other backing pods. Connecting through the service clearly isn’t the way to do this. What is?
> 
> For a client to connect to all pods, it needs to figure out the the IP of each individual pod. One option is to have the client call the Kubernetes API server and get the list of pods and their IP addresses through an API call, but because you should always strive to keep your apps Kubernetes-agnostic, using the API server isn’t ideal
> 
> Luckily, Kubernetes allows clients to discover pod IPs through DNS lookups. Usually, when you perform a DNS lookup for a service, the DNS server returns a single IP — the service’s cluster IP. But if you tell Kubernetes you don’t need a cluster IP for your service (you do this by setting the clusterIP field to None in the service specification ), the DNS server will return the pod IPs instead of the single service IP. Instead of returning a single DNS A record, the DNS server will return multiple A records for the service, each pointing to the IP of an individual pod backing the service at that moment. Clients can therefore do a simple DNS A record lookup and get the IPs of all the pods that are part of the service. The client can then use that information to connect to one, many, or all of them.
> 
> Setting the clusterIP field in a service spec to None makes the service headless, as Kubernetes won’t assign it a cluster IP through which clients could connect to the pods backing it.
> 
> "Kubernetes in Action" by Marco Luksa

### Secrets

Create a secret password

`kubectl create secret generic mysql-pass --from-literal=password=AMuchBetterWayToStoreAPassword`

Check secrets created

`kubectl get secrets`

Decoding a secret

`kubectl get secrets mysql-pass -o yaml`

### Auditing

[Auditing K8s](https://kubernetes.io/docs/tasks/debug-application-cluster/audit)

<!-- ## Kubernetes Architecture

### Components

#### Master Components

##### kube-apiserver

Component on the master that exposes Kubernetes API. It is the front-end for the Kubernetes control plane.

##### etcd

Consistent and highly-available key value store used as Kubernetes’ backing store for all cluster data.

##### kube-scheduler

Component on the master that watches newly created pods that have no node assigned, and selects a node for them to run on.

##### kube-controller-manager

Component on the master that runs controllers .

Logically, each controller is a separate process, but to reduce complexity, they are all compiled into a single binary and run in a single process.

These controllers include:

- Node Controller: Responsible for noticing and responding when nodes go down.
- Replication Controller: Responsible for maintaining the correct number of pods for every replication controller object in the system.
- Endpoints Controller: Populates the Endpoints object (that is, joins Services & Pods).
- Service Account & Token Controllers: Create default accounts and API access tokens for new namespaces.

### Node Components

#### kubelet

An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.

The kubelet takes a set of PodSpecs that are provided through various mechanisms and ensures that the containers described in those PodSpecs are running and healthy. The kubelet doesn’t manage containers which were not created by Kubernetes.

#### kube-proxy

kube-proxy is a network proxy that runs on each node in your cluster, implementing part of the Kubernetes ServiceA way to expose an application running on a set of Pods as a network service. concept.

kube-proxy maintains network rules on nodes. These network rules allow network communication to your Pods from network sessions inside or outside of your cluster.

kube-proxy uses the operating system packet filtering layer if there is one and it’s available. Otherwise, kube-proxy forwards the traffic itself.

#### Container Runtime

The container runtime is the software that is responsible for running containers.

Kubernetes supports several container runtimes: Docker, containerd, [cri-o](https://cri-o.io/), rktlet and any implementation of the Kubernetes CRI (Container Runtime Interface).

![](https://cri-o.io/assets/images/architecture.png)

### Pods

A Pod is a group of one or more containers, with shared storage/network, and a specification how to run the containers.

Containers within a Pod share an IP address and port space, and can find each other via localhost.

In terms of `Docker` constructs, a Pod is modelled as a group of Docker containers with shared namespaces and shared filesystem volumes.

### Patterns of Modular App Development

![Three Patterns](./images/k8s/multi-container-pod-design.png)

Follow is three patterns to be used to create a Pod:

#### Sidecar Containers

Example:

The sidecar container is nginx serving that log file. (In practice, your sidecar is likely to be a log collection container that uploads to external storage.)

![Sidecar Pattern](./images/k8s/sidecar-containers.png)

#### Adapter Pattern

Example:

It defines a main application container which writes
the current date and system usage information to a log file 
every five seconds.

The adapter container reads what the application has written and
reformats it into a structure that a hypothetical monitoring 
service requires.

![Adapter Pattern](./images/k8s/adapter-containers.png)

#### Ambassador pattern (Proxy)

Example:

One of the best use-cases for the ambassador pattern is for providing access to a database. When developing locally, you probably want to use your local database, while your test and production deployments want different databases again.

The application will always use localhost to communicate with the database, because it will the Ambassador.

![Ambassador Pattern](./images/k8s/ambassador-containers.png)

## Kubernetes Concepts

### Health Check

- Readiness Probes: To determine when a Pod is "ready" (e.g. after it has started to see when it's ready and has loaded what it needs to internally in the image and is ready to take requests from external services)

- Liveness Probes: To determine when a Pod is "healthy" or "unhealthy" after it has become ready

## Usage & Resource Monitoring

`Heapster` has been deprecated.

~~`Heapster` uses `InfluxDB` and `Grafana`. `InfluxDB` is used to store data for `Grafana`~~

~~Enable add on `heapster`~~

~~`minikube addons enable heapster`~~

~~Check if it is on~~

~~`kubectl get pods --namespace=kube-system`~~

~~When pods are up we can access the Grafana Dashboard~~

~~`minikube addons open heapster`~~

An interest open-source OpsView for K8S is [kube-ops-view](https://github.com/hjacobs/kube-ops-view).

It gave a operational picture of nodes, pods and each container inside of these pods.

There are many other including some paid like `New Relic`. -->

## Troubleshooting commands

Check logs deployment

`kubectl logs -l app=wordpress (labels)`

## Curious Things

### Namespace & Resource Quotas

If a deployment doesn't have enough memory or cpu to set up. It will fail. For example:

I have a limit of 200m memory, created previously with namespace, and I want to set up 3 containers that request at least 200m per container

So all the containers will not set up, because it will not pass at the `MinimumReplicasUnavailable`.

## Labs

- Create YAML that starts a deployment for Nginx, using version 1.8. 3 replicas must go live and should add the label app=nginx.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lab5-nginx
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.8
        ports:
        - containerPort: 80
```

- Use command to show all resources that use the label app=nginx.

`kubectl get all --selector app=nginx`

- Change the number of replicas to 4.

`kubectl scale --replicas=4 deployment lab5-nginx`

- Upgrade the Nginx deployment to v1.15 of Nginx.

`kubectl edit deployment lab5-nginx`

- Expose a deployment with type NodePort

`kubectl expose deploy lab5-nginx --type=NodePort`

```bash
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP        22h
lab5-nginx   NodePort    10.96.194.241   <none>        80:32432/TCP   15h
nginx-dash   ClusterIP   10.96.219.184   <none>        80/TCP         16h
```

`curl $(minikube ip):32432`

```bash
 % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   612  100   612    0     0   597k      0 --:--:-- --:--:-- --:--:--  597k<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

- Get pods of namespace default using `curl`

`kubectl proxy --port=8001 &`

`curl http://localhost:8001/api/v1/namespaces/default/pods`

- Install `metrics-server` for kubernetes

`kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`

- Verify health of `metrics-server`

`kubectl -n kube-system get pods` and `kubectl -n kube-system logs metrics-server-59d5c795dc-78qq4`

- Verify pods or nodes metrics of default namespace

`kubectl top pods` or `kubectl top nodes`

### Helm

- Add repo bitnami

`helm repo add bitnami https://charts.bitnami.com/bitnami && helm repo update`

- Install chart for `MariaDB`

`helm install mydb bitnami/mariadb`

## References & Cheatsheets

[Overview Kubectl](https://kubernetes.io/docs/reference/kubectl/overview/)

[Kubernetes Docs](https://kubernetes.io/docs)

[Enabling Kubectl Auto Completion](https://kubernetes.io/docs/tasks/tools/install-kubectl/#enabling-shell-autocompletion)

[Kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)