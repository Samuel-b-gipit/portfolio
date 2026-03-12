# Samuel Gipit

Software Engineer (Mid-Level)

Building enterprise-grade HR systems and scalable full-stack applications with a focus on data integrity, workflow architecture, and performance.

---

# Featured Projects

## AI-Assisted Workflow Builder

Intelligent workflow system that dynamically generates approval chains and validation logic based on organizational rules.

Tech Stack: Next.js, TypeScript, Node.js, PostgreSQL, OpenAI API

- Dynamic workflow configuration engine
- Role-based access control (RBAC)
- Optimistic locking for concurrent edits
- AI-assisted validation suggestions
- Real-time status tracking

Code: [GitHub Link]  
Demo: [Live Demo Link]

---

## Full-Stack SaaS Starter Platform

Production-ready SaaS foundation with authentication, subscription billing, and modular architecture.

Tech Stack: Next.js, Node.js, PostgreSQL, Stripe, Tailwind CSS

- JWT-based authentication
- Subscription billing integration
- Modular REST API architecture
- Database schema versioning
- Role-based dashboards

Code: [GitHub Link]  
Demo: [Live Demo Link]

---

## Contract Versioning System (Standalone)

Standalone contract lifecycle management system with version tracking and concurrency safeguards.

Tech Stack: Node.js, PostgreSQL, Prisma, Express

- Unique contract number atomic enforcement
- Contract version history (v1, v2, v3...)
- Draft → Pending → Approved → Archived lifecycle
- Soft delete and restoration logic
- Conflict detection for concurrent edits

Code: [GitHub Link]  
Demo: [Live Demo Link]

---

## Reverse Hiring App

Employer-focused recruitment platform where employers browse applicant profiles and send proposals directly.

Tech Stack: Next.js, Node.js, PostgreSQL, Tailwind CSS

- Employer dashboard for browsing applicants
- Proposal generation and tracking system
- Role-based access for employers and applicants
- Real-time notifications on application status
- Optimistic locking to avoid proposal conflicts

Code: [GitHub Link]  
Demo: [Live Demo Link]

---

# Experience

## Personnel Selection Board (PSB) System

Client: Local Government Unit  
Role: Software Engineer

Enterprise hiring workflow system supporting department-level approval processes.

- Designed configurable multi-step approval engine
- Implemented role-based access control (Admin, Reviewer, Approver)
- Built audit logging for decision traceability
- Implemented optimistic locking to prevent race conditions
- Integrated email notifications for workflow transitions
- Supported 17,000+ active users across departments

---

## COS / Non-Plantilla Hiring & Contract Management

Client: Local Government Unit  
Role: Software Engineer

Contract-based hiring workflow with bundled application processing.

- Developed application bundling system for contract generation
- Enforced atomic uniqueness of contract numbers
- Implemented contract versioning and rollback support
- Designed lifecycle management (Draft → Pending → Approved → Archived)
- Added concurrency safeguards to prevent duplicate contract issuance
- Built status-based validation and approval constraints

---

## Payroll Information System

Client: Local Government Unit  
Role: Software Engineer

Central payroll engine connecting all HRIS modules to generate accurate compensation reports.

- Designed payroll calculation engine using position, salary grade, attendance, and benefit data
- Implemented validation rules to prevent payroll discrepancies
- Integrated mandatory deductions and benefit computations
- Built secure access layers for salary data visibility
- Generated payroll reports with audit-ready tracking

---

## HRIS Dependency Modules

Client: Local Government Unit  
Role: Software Engineer

Core data libraries powering the HRIS ecosystem.

### Position Library (Versioned)

- Designed position catalog with version tracking
- Enabled historical salary reference consistency
- Linked position versions to payroll computation logic

### Salary Grade Management

- Built salary grade mapping module
- Integrated grade-based compensation computation
- Enforced validation for grade transitions

---

# Tech Stack

Languages: TypeScript, JavaScript, SQL  
Frontend: Next.js, React, Tailwind CSS  
Backend: Node.js, Express  
Database: PostgreSQL, DynamoDB  
Cloud: AWS Amplify, S3  
Tools: Git, Postman, Prisma  
Concepts: RBAC, Optimistic Locking, Concurrency Control, Transaction Management, Versioning Systems, Database Architecture, Audit Logging
