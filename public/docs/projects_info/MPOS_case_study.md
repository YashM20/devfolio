# Project Case Study Submission – PrometheanTech

## 1. Project Name

MPOS (Mobile Point of Sale)

## 2. Employee Name

Yash Mahajan

## 3. Role

Frontend Developer (React Native)

## 4. Project Duration

May 2022 - May 2023

## 5. Industry

Retail / Point of Sale (POS)

## 6. Client Name Allowed

PIPLI TECHNOLOGIES PRIVATE LIMITED

## 7. Problem Statement

Retail store associates were tied to fixed cash registers for billing, creating long queues and poor floor mobility. Existing systems lacked mobility, real-time order handling, multi-payment support, and streamlined invoice management for store associates. A mobile solution that could work anywhere on the store floor, handle multiple payment types simultaneously, generate receipts without a PC, and manage customer loyalty programs on the go.

## 8. Project Objective

Build a cross-platform mobile Point of Sale application for Android and iOS that enables store staff to manage billing, invoices, customer transactions, product search, returns, coupon/promotion handling, multi-order hold/resume capability and multiple payment methods from handheld devices.

## 9. Solution Summary

Built a cross-platform React Native mobile POS application using Expo SDK. The app allows associates to browse products by category, scan barcodes for quick lookup, build orders with real-time pricing, apply discounts/coupons, process split payments (cash, card, cheque, wallet, UPI), generate PDF thermal receipts on-device, and handle returns/refunds, all from a phone.

## 10. Key Features

* Device registration and OTP-based authentication with GPS location gating
* Category-based product browsing with image thumbnails and 2-column grid
* Barcode scanning for products, credit notes, and order lookups (expo-barcode-scanner)
* Persistent cart with offline survival (Redux Persist to AsyncStorage)
* Hold/resume multiple orders simultaneously with named tabs
* Customer search, auto-registration, and loyalty wallet integration
* Three discount types: flat amount, percentage, and coupon code with backend validation
* Active promotions and campaign display with customer-specific coupons
* Split-payment checkout supporting cash + card + cheque + wallet (OTP-verified) + UPI simultaneously
* HTML-to-PDF receipt generation using expo-print with automatic server upload
* Full and partial return/refund processing
* UPI QR code generation and clipboard copy in profile management
* Frequent product suggestion alerts based on customer purchase history

## 11. Frontend Tech

React Native, Expo SDK, Redux + Redux-Thunk + Redux-Persist, React Navigation v6 (Stack + Drawer), React Native Paper, React Native Reanimated, React Native Gesture Handler.

## 12. Backend Tech

RESTful Microservices (6 separate services: Core POS, Campaign, Coupon, Retailer, Billing, File Upload). APIs consumed via native fetch and Axios.

## 13. Database

Client-side: React Native AsyncStorage (auth tokens, device IDs, UPI IDs, customer info, coupon state, category selection, hold order IDs). Server-side: managed by backend team.

## 14. Cloud Platform

Azure and GCP, distributed across multiple cloud providers.

## 15. DevOps Tools

Expo Application Services (EAS Build) for APK/production builds, Yarn package manager, Bitbucket for source control.

## 16. AI/ML Used

No

## 17. AI/ML Details

N/A

## 18. Individual Contribution

* Designed and built all 15+ screens from scratch using React Native JSX and StyleSheet (no CSS frameworks)
* Implemented the complete authentication flow: device registration, OTP verification with animated code fields, JWT token extraction and storage, GPS-based location gating
* Built the Home dashboard with horizontal category scrolling, 2-column product grid, customer search with auto-registration, and hold order management (save, restore, remove)
* Created the CartScreen with inline price editing, three discount input types, coupon code validation against a remote microservice, active promo/campaign listing, and a cart refresh/review workflow
* Developed the CheckoutScreen supporting 5 simultaneous payment methods with real-time split-payment calculations, cheque date validation with regex formatting, wallet OTP verification and balance inquiry, and credit note barcode scanning
* Implemented PDF receipt generation: built HTML templates with embedded base64 images, converted to PDF via expo-print, read file metadata via expo-file-system, and uploaded to the billing server
* Built the barcode scanner with context-aware routing (product lookup, credit note capture, return order scanning)
* Created the Profile screen with UPI ID registration, server-side save, QR code generation via upiqr.in API, WebView rendering, and clipboard copy functionality
* Integrated Redux + Redux Persist for offline-capable state management across the entire app
* Configured the complete navigation architecture: Drawer + Stack with transparent modal overlays for Cart, Checkout, and Review screens

## 19. Challenges

* Managing extremely complex screens with multiple payment method states updating in real-time without UI lag
* Implementing split-payment math where 5 different payment amounts must be dynamically calculated as the user types
* Generating print-quality PDF invoices entirely on the client side without any server-side templating
* Handling cheque date validation with proper DD/MM/YYYY formatting and future-date verification using manual regex parsing
* Maintaining cart state across app crashes, network failures, and device restarts
* Coordinating with 6 different backend microservices on different IPs/ports with varying authentication requirements

## 20. Solutions

* Used Redux Persist with AsyncStorage to ensure cart and auth state survive crashes and restarts
* Built a unified payment state calculator that recomputes totalPaidAmount across all 5 channels whenever any single amount changes
* Used expo-print to compile custom HTML strings with inline CSS and base64 images into standalone PDFs, then expo-file-system to read file metrics for upload
* Implemented transparent modal navigation for Cart/Checkout/Review screens, keeping the previous screen visible underneath for quick back-navigation
* Created a dedicated ApiConfig.js module centralizing all 6 backend URLs with consistent fetch patterns across 8 API modules
* Used react-native-reanimated for 60fps OTP cell animations running on the native thread

## 21. Measurable Results

* Successfully ported 100% of targeted web POS capabilities to mobile across both Android and iOS
* Reduced checkout time by enabling floor-anywhere billing (no fixed register required)
* Achieved zero-downtime cart persistence, cart data survives app crashes, network loss, and device restarts
* Supported 5 simultaneous payment methods in a single transaction (industry requirement)
* Generated PDF receipts entirely on-device, eliminating dependency on server-side rendering infrastructure

## 22. Business Impact

* Transformed store operations by freeing associates from fixed registers they can now process transactions anywhere on the floor
* Reduced customer queue times by enabling parallel order processing via the hold/resume system
* Enabled customer-linked e-billing and loyalty wallet integration directly from mobile
* Eliminated the need for dedicated POS hardware, any Android/iOS device becomes a cash register
* Enabled real-time promotion and coupon application at the point of sale, increasing campaign effectiveness

## 23. Architecture Summary

Atomically-structured React Native application using a Drawer + Stack navigation pattern with transparent modal overlays. State is managed centrally via Redux (2 reducers: User + Cart) with full disk persistence via Redux Persist. The app communicates with 6 distributed backend microservices (across Azure and GCP) through 8 dedicated API modules using fetch and Axios. Hardware integration covers camera (barcode scanner), GPS (location gating), file system (PDF storage/upload), and printing (receipt generation). The component layer follows an atoms/templates pattern for reusable UI elements.

## 24. Scalability Improvements

* Decoupled all API calls into 8 separate modules, each handling a single microservice, new services can be added without touching existing code
* Built reusable atomic components (AlertBox, LoginButton, PrincipalButton, MenuImage) used across all 15+ screens
* Centralized all backend URLs in ApiConfig.js, environment switching requires changing a single file
* Used Redux Persist so the app functions during network outages, orders can be built offline and synced when connectivity returns
* PDF receipt generation happens entirely on-device, reducing server bandwidth and eliminating a scaling bottleneck
* Hold order system allows one device to manage multiple simultaneous customers, multiplying throughput per device
