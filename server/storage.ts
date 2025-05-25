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
        effectiveDate: "May 26, 2025",
        lastUpdated: "May 26, 2025",
        content: `
# Terms of Service

## Introduction

By entering information, I agree to Hushh's Terms of Service, Non-discrimination Policy and Payments Terms of Service and acknowledge the Privacy Policy.

These Terms of Service ("Terms") govern your use of Hushone, Inc's services. By accessing or using our services, you agree to be bound by these Terms.

## Acceptance of Terms

By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.

## Use of Services

You may use our services only in compliance with these Terms and all applicable laws and regulations. Our services are designed to provide you with secure and personalized experiences.

### Permitted Uses

- Access and use services for lawful purposes
- Create an account with accurate information
- Comply with all applicable laws and regulations
- Use services in accordance with their intended functionality

### Prohibited Uses

- Violate any laws or regulations
- Infringe on intellectual property rights
- Engage in fraudulent or deceptive practices
- Upload malicious software or content
- Attempt to gain unauthorized access to our systems

## Account Responsibilities

You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.

## Data and Privacy

Your privacy and data security are our highest priorities. We never sell your personal data and strictly manage your information responsibly and securely in accordance with our Privacy Policy.

## Service Availability

We strive to maintain service availability but cannot guarantee uninterrupted access. We reserve the right to modify or discontinue services with reasonable notice.

## Limitation of Liability

Our liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages arising from your use of our services.

## Contact Information

For questions about these Terms, contact us at info@hush1one.com, call us at +14252969050, or visit us at Hushh.ai, 1021 5th St W, Kirkland, WA 98033, USA.
        `
      },
      {
        type: "non-discrimination",
        title: "Non-Discrimination Policy",
        icon: "fas fa-balance-scale",
        effectiveDate: "May 26, 2025",
        lastUpdated: "May 26, 2025",
        content: `
# Hushone, Inc Non-Discrimination Policy

At Hushone, Inc ("Hushone," "we," "us," or "our"), we strongly uphold principles of equality, fairness, and respect. We are committed to maintaining a workplace and services environment free from discrimination.

## Our Commitment

Hushone does not and will not discriminate on the basis of race, color, ethnicity, national origin, religion, age, disability, sex, gender identity or expression, sexual orientation, marital status, veteran status, socioeconomic background, or any other characteristic protected by applicable laws. This commitment extends to all employment decisions, customer interactions, and service provisions.

## Equal Opportunity Employer

As an equal opportunity employer, we ensure that employment practices—including hiring, promotion, training, compensation, benefits, disciplinary action, and termination—are conducted based solely on merit, qualifications, and abilities relevant to job performance, without discrimination.

## Inclusive Services

Our services, products, and platforms are accessible and inclusive. We provide equal access and fair treatment to all individuals, ensuring that no person faces exclusion or differential treatment based on protected characteristics.

## Reporting and Enforcement

Any individual who believes they have experienced or witnessed discrimination within Hushone's workplace or services is strongly encouraged to report it promptly. Concerns can be raised confidentially by contacting us at:

**Email:** info@hush1one.com

**Address:** 1021 5th St W, Kirkland, WA 98033

Hushone prohibits retaliation against anyone who, in good faith, reports discrimination or participates in investigations related to such reports. We commit to promptly investigating all reports and taking appropriate corrective actions when necessary.

## Continuous Improvement

We continuously assess and improve our policies and practices to ensure alignment with our values of equality, diversity, and inclusion. Regular training and communication reinforce this commitment throughout our organization.

## Contact Us

For any questions or concerns regarding our Non-Discrimination Policy, please contact:

**Email:** info@hush1one.com

**Address:** 1021 5th St W, Kirkland, WA 98033

At Hushone, we firmly believe in creating and sustaining an inclusive environment for all.
        `
      },
      {
        type: "payment-terms",
        title: "Payments Terms of Service",
        icon: "fas fa-credit-card",
        effectiveDate: "May 26, 2025",
        lastUpdated: "May 26, 2025",
        content: `
# Payments Terms of Service

## Introduction

These Payment Terms govern all financial transactions and billing practices for Hushone, Inc services. By using our paid services, you agree to these payment terms.

## Payment Methods

We accept the following payment methods to ensure convenient and secure transactions:

### Accepted Payment Types
- Major credit cards (Visa, MasterCard, American Express, Discover)
- Debit cards with credit card logos
- Digital payment platforms (PayPal, Apple Pay, Google Pay)
- Bank transfers (ACH) for eligible accounts
- Other payment methods as we may offer from time to time

## Billing and Charges

### Subscription Services
- Charges are billed in advance for subscription periods
- Billing cycles may be monthly, quarterly, or annually as selected
- All prices are listed in USD unless otherwise specified
- Prices are subject to change with 30 days advance notice

### One-Time Purchases
- Payment is required at the time of purchase
- All sales are final unless otherwise specified in our refund policy
- Digital products are delivered immediately upon successful payment

## Payment Processing and Security

### Authorization and Security
- You authorize us to charge your selected payment method for applicable fees
- You must provide accurate and current billing information
- We use industry-standard security measures to protect payment information
- Payment processing is handled by certified third-party payment processors

### Failed Payments and Account Status
- Service may be suspended for failed or declined payments
- We will attempt to notify you of payment failures
- Late fees may apply for overdue accounts as permitted by law
- We reserve the right to terminate services for continued payment failures

## Refunds and Cancellations

### Subscription Cancellations
- You may cancel your subscription at any time through your account settings
- Cancellations take effect at the end of the current billing period
- No partial refunds for unused subscription time unless required by law

### Refund Policy
- Refund requests must be submitted within 30 days of the original transaction
- Refunds are processed to the original payment method when possible
- Processing time for refunds is typically 5-10 business days
- Certain digital products may have different refund terms

## Taxes and Fees

You are responsible for all applicable taxes, duties, and government fees related to your use of our services, unless we are legally required to collect such taxes.

## Contact Information

For billing questions, payment issues, or refund requests, please contact us at info@hush1one.com, call us at +14252969050, or write to us at Hushh.ai, 1021 5th St W, Kirkland, WA 98033, USA.
        `
      },
      {
        type: "privacy-policy",
        title: "Privacy Policy",
        icon: "fas fa-shield-alt",
        effectiveDate: "May 26, 2025",
        lastUpdated: "May 26, 2025",
        content: `
# Hushone, Inc Privacy Policy

At Hushone, Inc ("Hushone," "we," "our," or "us"), your privacy and data security are our highest priorities. This Privacy Policy clearly explains how we collect, use, and safeguard your personal data. Importantly, we never sell your personal data and strictly manage your information responsibly and securely.

## What is Personal Data?

Personal data refers to any information that identifies or can reasonably identify an individual, such as names, email addresses, device identifiers, or financial details.

## Information We Collect

We collect personal data essential for delivering and improving our services. This includes:

### Information You Provide

- Account and profile details
- Payment and billing data
- Content you share via our services
- Communications and support requests

### Information Collected Automatically

- Device identifiers and usage patterns
- Location information (as per your device settings)
- Cookies and similar technologies to enhance user experience
- Log data and analytics information

### Information from Third Parties

- Data from verified partners and publicly available resources
- Data you authorize third parties to share with us
- Information from social media platforms when you connect accounts

## How We Use Your Information

We responsibly use your personal data for:

### Service Delivery
Providing and improving products and services, ensuring personalization, functionality, and user satisfaction.

### Communications
Informing you about updates, transactions, security alerts, and customer support.

### Security and Fraud Prevention
Protecting you, Hushone, and our services against fraudulent and illegal activities.

### Legal Compliance
Complying with applicable laws, regulations, and legal obligations.

## Sharing Your Information

Your personal data is shared only in the following limited circumstances:

- **Service Providers:** With authorized service providers who strictly handle your data on our behalf under contractual obligations to ensure privacy
- **Legal Requirements:** When mandated by law or to protect legal rights
- **Business Transfers:** In cases of mergers or acquisitions, data transfer occurs under strict confidentiality and security protocols

We explicitly state that Hushone does not sell or share personal data for third-party marketing purposes as defined by applicable laws, including those of Nevada and California.

## Your Rights and Choices

You have full control over your personal data, including rights to:

### Access and Control
- Access and update your data via account settings
- Request data deletion, subject to certain limitations such as legal compliance obligations
- Object or restrict specific data processing activities
- Withdraw consent where applicable

To exercise your privacy rights, contact us at info@hush1one.com, call us at +14252969050, or visit our website Hushh.ai.

## International Data Transfers

As a global company, data may be transferred internationally in compliance with strict data protection laws and frameworks such as Standard Contractual Clauses and APEC Privacy guidelines, ensuring data protection at all times.

## Security Measures

We implement rigorous security measures—administrative, technical, and physical—to protect your data from unauthorized access, misuse, or disclosure. Security practices are continually updated and reviewed.

## Children's Privacy

Our services do not intentionally target individuals under 13 years of age (or applicable legal age). We enforce strict measures to protect children's privacy and require verified parental consent for child accounts.

## Cookies and Technologies

We utilize cookies and similar technologies solely to improve functionality, analyze usage, and enhance security. You have options to manage or disable cookies through your browser settings.

## Policy Updates

We regularly update this Privacy Policy to reflect our data practices clearly. We will notify you of significant changes and seek your consent as required by law.

## Contact Us

If you have any questions regarding our privacy practices or this Privacy Policy, please contact us:

- **Email:** info@hush1one.com
- **Phone:** +14252969050
- **Website:** Hushh.ai
- **Address:** 1021 5th St W, Kirkland, WA 98033, USA

Your privacy is fundamental to Hushone, and we remain committed to transparency and integrity in managing your data.
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
