---
title: AWS Solutions Architect Professional
date: 2023-01-05
thumbnail_url: https://picsum.photos/id/766/320/240

---

My notes for AWS Solutions Architect Professional Exam
<!--more-->

## IAM

[Access Policies Examples](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_examples.html)

PowerUserAccess

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "NotAction": [
                "iam:*",
                "organizations:*",
                "account:*"
            ],
            "Resource": "*"
        },…
```

```json
…   
    {
    "Effect": "Allow",
    "Action": [
        "iam:CreateServiceLinkedRole",
        "iam:DeleteServiceLinkedRole",
        "iam:ListRoles",
        "organizations:DescribeOrganization”,
        "account:ListRegions"
    ],
    "Resource": "*"
    }
  ]
}
```

TODO: Check `NotAction` reference in order to understand better.

- IAM Policies Condition;
- IAM Policies Variable and Tags;

Assuming a role resource give up of his own policies.

TODO: Check `IAM Permission Boundaries` - https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html

### IAM Access Analyzer

#### IAM Access Analyzer Policy Validation

Validates grammar and best practices, review it giving warnings and errors and provide actionable recommendations.

#### IAM Access Analyzer Policy Generation

Generates IAM Policy based on logs saved on AWS CloudTrail. For example: a Lambda access Kinesis and S3 Bucket it will analyze for 90 days and it will create a policy based on these apis called, it generate least-privilege policy as a suggestion.

### Providing access to AWS Accounts Owned by Third Parties

For granting acesss to a third party:

- The third party AWS account ID
- An External ID, secret between you and the third party:
    - To uniquely associate with the role between you and third party
    - Must be provided when defining the trust and when assuming the role
    - Must be chosen by the third party
- Define permission in the IAM policy

#### Session Tags in Security Token Service (STS)

Tags that you pass when you assume an IAM Role or federate user in STS (aws:PrincipalTag condition).

Example:
![](2023-01-10-18-15-30.png)

#### STS Important APIs

- AssumeRole
- AssumeRoleWithSAML
- AssumeRoleWithWebIdentity
- GetSessionToken
- GetFederationToken

### Identity Federation

Give users outside of AWS permissions top access AWS resources in your account

**You don't need to create IAM Users (user management is outside AWS**

Use cases

- A corporate has its own identity system (e.g. Active Directory)
- Web/Mobile application that needs access to AWS resources

Identity federation flavors:

- SAML 2.0
- Custom Identity Broker
- Web Identity Federation With(out) Amazon Cognito
- Single Sign-on (SSO)

