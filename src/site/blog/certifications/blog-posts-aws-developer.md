---
title: AWS Associate Developer
date: 2020-09-10
thumbnail_url: https://picsum.photos/id/641/320/240
description:
    AWS Associate Developer Study
---

My notes for AWS Associate Developer Exam
<!--more-->

## AWS CLI & SDK

They use AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.

In order to configure CLI, we need to type `aws configure` and it will ask four questions. We will need ACCESS_KEY_ID and SECRET_ACCESS_KEY.

Do a command to test:

```sh
aws ec2 describe-instances
{
    "Reservations": []
}
```

How to use `JMESPath`:

Update the result

```bash
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[Placement.AvailabilityZone | [0], InstanceId, State.Name]'
{
    "Reservations": []
}
```

## IAM

Users, Group, Roles

### Users

- Programatic Access
- AWS Management Console Access

### Policies

Effect
Action
Resource
Condition

Copy of AWS Policy
Policy Wizard
Self-defined

### Groups

A collection of Users
Defined by a group Name (not change name because is linked to ARN)

### Roles

AWS identity with permission policies
Can be assumed 

### Identity Providers (IdP)

Integrate external identity database
Can assign permissions to users in that external IdP
Example: Corporate User Directory

#### Compatible IdPs

OpenID Connect (OIDC)
SAML

### IAM Access Methods

AWS Management Console
AWS CLI
AWS SDK

## Virtual Private Cloud (VPC)

- VPC dedicated to an AWS account
- Logically isolated from other VPCs
- Some AWS services are launched into or attached to VPC
- Configurable:
    - Subnet Ranges
    - Routing Tables
    - Gateways
    - Security

### Networking

If EC2 is restarted the private IP is not changed, but public IP will be changed
Multiple IPs can be assigned to an instance
Define and attach multiple network interfaces to one instance

### Security

Security Groups
Network ACLs (Access Control Lists)
Assign groups to VPC and EC2 instances

#### Internet Access

Access from VPC to Internet is via Internet Gateway
Access to/from Instance with public IP is via Internet Gateway
Instance with only Private IP address cannot access Internet but can talk to eaxh other
Alternative: NAT Gateway can be used for instances with only private IP addresses

