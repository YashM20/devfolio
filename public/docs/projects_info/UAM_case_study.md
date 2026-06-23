# Project Case Study Submission – PrometheanTech

## 1. Project Name
User Access Management (UAM)

## 2. Employee Name
Yash Mahajan

## 3. Role
Frontend

## 4. Project Duration
1.5 year - 06/11/2024 - current (17/04/2026)

## 5. Industry
Fintech (Private Capital / Investment Management)

## 6. Client Name Allowed
73 Strings

## 7. Problem Statement
The client operates a complex financial intelligence platform handling private equity, credit, and alternative assets. They lacked a centralized, scalable system to manage user roles and permissions across multiple financial entities and product lines. Existing approaches were fragmented, manual, and prone to security risks, especially with sensitive financial data and multi-tenant access scenarios

## 8. Project Objective
To design and build a robust, scalable User Access Management (UAM) system that enables:

- Fine-grained access control
- Secure multi-tenant user management
- Efficient permission handling across products and entities
- Compliance with enterprise-grade security standards

## 9. Solution Summary
Developed a scalable frontend-driven UAM module using Angular that enables administrators to manage users, roles, and permissions across complex financial hierarchies. The system supports dynamic permission mapping, hierarchical access control, background processing workflows, and real-time UI state updates.

## 10. Key Features
- Role-based access control (RBAC) with modular permissions
- Multi-entity hierarchy (Funds, Companies, etc.)
- Product-level permission control (Equity, Credit, Monitoring, Transactions)
- Dynamic permission assignment UI
- Bulk user creation with background processing
- Notification system with real-time status updates
- Hierarchical access propagation (parent-child sync)
- Client-side filtering and sorting
- Global modal system for async operations

## 11. Frontend Tech
Angular, Angular Material, PrimeNG, RxJS, TypeScript

## 12. Backend Tech
N/A

## 13. Database
N/A

## 14. Cloud Platform
N/A

## 15. DevOps Tools
N/A

## 16. AI/ML Used
No

## 17. AI/ML Details
N/A

## 18. Individual Contribution
- Led Angular 17 → 21 migration and modernization (standalone components, performance improvements)
- Led NgModule → Standalone architecture migration (tech debt cleanup)
- Migrated test suite from Jasmine/Karma to Vitest for faster and modern testing

### Notification System
- Infinite scroll
- Polling-based updates (no WebSockets)
- Dynamic state handling (success/pending/failure)
- Auto-refresh for pending operations

### Bulk User Creation
- Background processing
- Global modal (minimize/maximize across app)

### Access & Hierarchy
- Implemented SSO configuration UI at organization level
- Designed entity hierarchical access system:
  - Dynamic parent-child relationships
  - Accordion-based recursive UI
  - Multi-parent support
  - Access sync across hierarchy

### Permissions & Performance
- Built permission propagation logic (single node vs entire hierarchy)
- Optimized checkbox state updates in deep hierarchies
- Used localForage for handling large datasets client-side
- Developed client-side table filtering & sorting
- Contributed to overall performance optimization and UX improvements

## 19. Challenges
- Managing deeply nested and dynamic hierarchical data structures
- Handling large datasets (thousands of nodes/users) without UI lag
- Syncing access across multi-parent hierarchical relationships
- Avoiding UI freezes during bulk operations and permission updates
- Ensuring real-time UX without WebSockets (polling constraints)
- Tech debt from legacy Angular architecture (NgModules, Karma)

## 20. Solutions
- Designed recursive, optimized hierarchical data models with memoization
- Implemented efficient state updates and batching strategies
- Introduced localForage caching for large datasets
- Built custom polling system with intelligent refresh logic
- Used virtual scrolling & optimized change detection
- Migrated to standalone components + modern Angular patterns
- Replaced Karma with Vitest for faster execution and better DX

## 21. Measurable Results
- ~50% improvement in UI performance for large hierarchical datasets
- ~60% faster test execution after Vitest migration
- Significant reduction in UI freezes during bulk operations
- Improved responsiveness in permission updates (near real-time UX)
- ~30% app bundle reduction after ng module to standalone migration.

## 22. Business Impact
- Enabled scalable and secure user access control across financial products
- Reduced operational friction for admins managing large user bases
- Improved system usability → faster onboarding and configuration
- Strengthened platform reliability and enterprise readiness

## 23. Architecture Summary
- Angular-based modular frontend
- API-driven permission and user management
- Hierarchical data model for entity relationships
- Polling-based real-time updates for async operations

## 24. Scalability Improvements
- Designed UI to handle deep, dynamic hierarchies without re-render bottlenecks
- Implemented client-side caching (localForage) for large data
- Modular architecture enabling easy addition of new entities/products
- Optimized rendering and state updates for high-scale enterprise usage
- Migration to modern Angular improved long-term maintainability and scalability

