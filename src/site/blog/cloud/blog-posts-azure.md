---
title: Azure Web Services
date: 2020-09-22
thumbnail_url: https://picsum.photos/id/640/640/480
tags:
    - post
    - azure
---

My notes for Aure Cloud
<!--more-->

Watch it later https://www.youtube.com/watch?v=4BwyqmRTrx8

## Authentication

**Azure Active Directory** = identity service provides single sign-on and multi-factor authentication [Azure AD](https://azure.microsoft.com/en-us/services/active-directory/#overview)

## Host

**Azure DNS** = host your Domain Name System (DNS) domains in Azure [Azure DNS](https://azure.microsoft.com/en-us/services/dns/#overview)

## Security

**Azure Key Vault** = Safeguard cryptographic keys and other secrets used by cloud apps and services [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/#overview)

**Web Application Firewall (WAF)** = Help protect your web apps from malicious attacks and common web vulnerabilities - OWASP Top 10 [WAF](https://azure.microsoft.com/en-us/services/web-application-firewall/#overview)

**DDoS Protection** = [DDoS Protection](https://azure.microsoft.com/en-us/services/ddos-protection/)

## Databases

TODO

## Storage

**Blob Storage** = helps you create data lakes for your analytics needs, and provides storage to build powerful cloud-native and mobile apps [Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/#overview)

## Networking

**Application Gateway** = Build secure, scalable, highly available web front ends in Azure [App Gateway](https://azure.microsoft.com/en-us/services/application-gateway/) Used for deliver __**regional**__ web apps. Layer 7 = Application Layer. HTTP, HTTPS, HTTP/2

**FrontDoor** = Secure, fast, and reliable cloud CDN with intelligent threat protection [FrontDoor](https://azure.microsoft.com/en-us/services/frontdoor/). Used for deliver __**global**__ web apps. Layer 7 = Application Layer. HTTP, HTTPS, HTTP/2

**Azure Load Balancer** = Build high-availability and network performance. Used for deliver either for __**global**__ web apps or __**regional**__ web apps. Layer 4 = Network Layer. TCP/UDP

## DevOps

**Azure DevOps** = Include many tools like `Azure Boards`, `Azure Repos`, `Azure Pipelines` and etc. [Azure DevOps](https://azure.microsoft.com/en-us/services/devops/#overview)

## Observability

**Azure Monitor** = Collect, analyze, and act on telemetry data from your Azure and on-premises environments [Azure Monitor](https://azure.microsoft.com/en-us/services/monitor/#overview)

**App Insights** is a feature of `Azure Monitor` is an extensible Application Performance Management (APM) service for developers and DevOps professionals. [More info](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

![App Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/media/app-insights-overview/diagram.png)

## Containers

**Azure Kubernetes Service (AKS)** = Build and scale with managed Kubernetes [AKS](https://azure.microsoft.com/en-us/services/kubernetes-service/)

**Container Registry** = Build, store, secure, scan, replicate, and manage container images and artifacts with a fully managed, geo-replicated instance of OCI distribution [Container Registry](https://azure.microsoft.com/en-us/services/container-registry/)

## Integration

**API Management** = Publish APIs to developers, partners, and employees securely and at scale [API Management](https://azure.microsoft.com/en-us/services/api-management/)

## More links

Price calculator = https://azure.microsoft.com/pt-br/pricing/calculator/

Well-Architected Framework = https://docs.microsoft.com/en-us/azure/architecture/framework/

Azure services list = https://azure.microsoft.com/en-us/services/


