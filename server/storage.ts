import { policies, type Policy, type InsertPolicy } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  getAllPolicies(): Promise<Policy[]>;
  getPolicyByType(type: string): Promise<Policy | undefined>;
  createPolicy(policy: InsertPolicy): Promise<Policy>;
  updatePolicy(type: string, policy: Partial<InsertPolicy>): Promise<Policy | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private policies: Map<string, Policy>;
  currentId: number;
  currentPolicyId: number;

  constructor() {
    this.users = new Map();
    this.policies = new Map();
    this.currentId = 1;
    this.currentPolicyId = 1;
    this.initializePolicies();
  }

  private initializePolicies() {
    const defaultPolicies: InsertPolicy[] = [
      {
        type: "terms-of-service",
        title: "Terms of Service",
        icon: "fas fa-file-contract",
        effectiveDate: "January 1, 2024",
        lastUpdated: "January 1, 2024",
        content: `
# Introduction

These Terms of Service ("Terms") govern your use of our services. By accessing or using our services, you agree to be bound by these Terms.

## Acceptance of Terms

By entering information, I agree to these Terms of Service, our Non-discrimination Policy and Payment Terms of Service and acknowledge our Privacy Policy.

## Use of Services

You may use our services only in compliance with these Terms and all applicable laws and regulations.

### Permitted Uses

- Access and use services for lawful purposes
- Create an account with accurate information
- Comply with all applicable laws and regulations

### Prohibited Uses

- Violate any laws or regulations
- Infringe on intellectual property rights
- Engage in fraudulent or deceptive practices
- Upload malicious software or content

## Account Responsibilities

You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

## Service Availability

We strive to maintain service availability but cannot guarantee uninterrupted access. We reserve the right to modify or discontinue services with notice.

## Limitation of Liability

Our liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages.

## Contact Information

For questions about these Terms, contact us at legal@company.com or (555) 123-4567.
        `
      },
      {
        type: "non-discrimination",
        title: "Non-Discrimination Policy",
        icon: "fas fa-balance-scale",
        effectiveDate: "December 15, 2023",
        lastUpdated: "December 15, 2023",
        content: `
# Non-Discrimination Policy

We are committed to providing equal opportunities and maintaining a workplace free from discrimination and harassment.

## Our Commitment

We prohibit discrimination based on race, color, religion, sex, national origin, age, disability, sexual orientation, gender identity, or any other protected characteristic.

## Scope of Policy

This policy applies to all aspects of our services and employment, including:

### Service Provision
- Equal access to services for all users
- Fair treatment regardless of protected characteristics
- Accommodation for disabilities where reasonable

### Employment Practices
- Hiring and recruitment
- Promotion and advancement opportunities
- Compensation and benefits
- Training and development

## Reporting Discrimination

If you experience or witness discrimination:

1. Report the incident to our legal team
2. Provide detailed information about the incident
3. We will investigate promptly and confidentially
4. No retaliation will be tolerated for good faith reports

## Enforcement

Violations of this policy may result in corrective action, up to and including termination of service or employment.

## Training and Education

We provide regular training on discrimination prevention and inclusive practices to ensure a respectful environment for all.

## Contact Information

Report discrimination concerns to legal@company.com or call our confidential hotline at (555) 123-4567.
        `
      },
      {
        type: "payment-terms",
        title: "Payment Terms of Service",
        icon: "fas fa-credit-card",
        effectiveDate: "January 10, 2024",
        lastUpdated: "January 10, 2024",
        content: `
# Payment Terms of Service

These Payment Terms govern all financial transactions and billing practices for our services.

## Payment Methods

We accept the following payment methods:

### Accepted Payment Types
- Major credit cards (Visa, MasterCard, American Express)
- Debit cards
- Bank transfers (ACH)
- Digital payment platforms (PayPal, Apple Pay, Google Pay)

## Billing and Charges

### Subscription Services
- Charges are billed in advance for subscription periods
- Billing cycles are monthly or annually as selected
- Prices are subject to change with 30 days notice

### One-Time Purchases
- Payment is required at time of purchase
- All sales are final unless otherwise specified
- Refunds are processed according to our refund policy

## Payment Processing

### Authorization
- You authorize us to charge your selected payment method
- You must provide accurate billing information
- You are responsible for maintaining current payment information

### Failed Payments
- Service may be suspended for failed payments
- Late fees may apply for overdue accounts
- We will attempt to collect payment before service termination

## Refunds and Cancellations

### Subscription Cancellations
- Cancel anytime through your account settings
- Cancellations take effect at the end of the current billing period
- No partial refunds for unused subscription time

### Refund Requests
- Request refunds within 30 days of purchase
- Refunds are processed to the original payment method
- Processing time is 5-10 business days

## Taxes

You are responsible for all applicable taxes related to your use of our services.

## Contact Information

For billing questions, contact billing@company.com or (555) 123-4567.
        `
      },
      {
        type: "privacy-policy",
        title: "Privacy Policy",
        icon: "fas fa-shield-alt",
        effectiveDate: "January 15, 2024",
        lastUpdated: "January 15, 2024",
        content: `
# Privacy Policy

This Privacy Policy describes how we collect, use, and protect your personal information when you use our services.

## Introduction

By entering information, I agree to our Terms of Service, Non-discrimination Policy and Payment Terms of Service and acknowledge this Privacy Policy.

We are committed to protecting your privacy and ensuring the security of your personal information. This policy explains what information we collect, how we use it, and your rights regarding your data.

## Information We Collect

### Personal Information

We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

#### Types of Information Collected:
- Name and contact information
- Account credentials and preferences
- Payment and billing information
- Communication history and support requests

### Automatically Collected Information

We automatically collect certain information about your device and how you interact with our services, including:
- IP address and location data
- Browser type and version
- Usage patterns and preferences
- Device characteristics

## How We Use Your Information

### Service Operation
To provide, maintain, and improve our services, process transactions, and provide customer support.

### Communication
To send you service-related notifications, updates, and respond to your inquiries.

### Legal Compliance
We process your personal information based on legitimate business interests, legal compliance requirements, and with your consent where required by law.

## Information Sharing and Disclosure

**Important:** We do not sell, trade, or otherwise transfer your personal information to third parties without your explicit consent, except as described in this policy.

### When We May Share Information
- With service providers who assist in our operations
- To comply with legal obligations or protect our rights
- In connection with a business transfer or merger
- With your explicit consent for specific purposes

## Your Rights and Choices

You have the following rights regarding your personal information:

### Access
View the personal information we have about you

### Correct
Update or correct your personal information

### Delete
Request deletion of your personal data

### Portability
Request a copy of your data in a portable format

To exercise any of these rights, please contact us using the information provided below. We will respond to your request within 30 days.

## Data Security

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Data Retention

We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.

## Contact Information

If you have any questions about this Privacy Policy or our data practices, please contact us:

- Email: privacy@company.com
- Phone: (555) 123-4567
- Address: 123 Business St, City, State 12345

This document was last updated on January 15, 2024.
        `
      }
    ];

    defaultPolicies.forEach(policy => {
      const id = this.currentPolicyId++;
      const fullPolicy: Policy = {
        ...policy,
        id,
        createdAt: new Date()
      };
      this.policies.set(policy.type, fullPolicy);
    });
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentId++;
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllPolicies(): Promise<Policy[]> {
    return Array.from(this.policies.values());
  }

  async getPolicyByType(type: string): Promise<Policy | undefined> {
    return this.policies.get(type);
  }

  async createPolicy(insertPolicy: InsertPolicy): Promise<Policy> {
    const id = this.currentPolicyId++;
    const policy: Policy = {
      ...insertPolicy,
      id,
      createdAt: new Date()
    };
    this.policies.set(insertPolicy.type, policy);
    return policy;
  }

  async updatePolicy(type: string, updateData: Partial<InsertPolicy>): Promise<Policy | undefined> {
    const existingPolicy = this.policies.get(type);
    if (!existingPolicy) return undefined;

    const updatedPolicy: Policy = {
      ...existingPolicy,
      ...updateData
    };
    this.policies.set(type, updatedPolicy);
    return updatedPolicy;
  }
}

export const storage = new MemStorage();
