### **1. Project Name**

LivCast – Mobile Live Streaming Application

### **2. Employee Name**

Yash Mahajan

### **3. Role**

Frontend Developer (React Native)

### **4. Project Duration**

March 2021 – June 2022 (Core)

### **5. Industry**

Media & Entertainment

### **6. Client Name Allowed**

PARSHIL LIVCAST STREAMING INFOTECH PRIVATE LIMITED

---

## **7. Problem Statement**

Live streaming demand is rapidly growing, especially in mobile-first markets like India, but most solutions are still desktop-heavy. Tools like OBS are powerful but bulky, complex, and not designed for everyday mobile users.

Creators had to rely on multiple tools to stream across platforms, manage content, and engage audiences, making the process inefficient and hard to scale. There was no simple, mobile-first solution that combined multi-platform streaming, content management, and reliable low-latency performance in one place.

---

## **8. Project Objective**

* Enable seamless multi-platform streaming (Facebook, YouTube, Twitch) from a single app
* Support multiple input sources (RTMP, uploads, external links, camera, podcasts)
* Provide advanced scheduling (one-time, recurring, automated streams)
* Support 24/7 continuous streaming with loop playback for pre-recorded content
* Enable real-time analytics & monitoring (viewers, latency, engagement)
* Provide content editing capabilities (trimming, filters, transitions) before streaming
* Support custom RTMP destinations for platform flexibility
* Ensure low-latency and reliable streaming pipeline using standard protocols like RTMP
* Offer a mobile-first, easy-to-use experience replacing complex desktop tools

---

## **9. Solution Summary**

Built a mobile-first live streaming platform using React Native (Android/iOS) that enables users to stream pre-recorded or live content across multiple platforms via a unified interface.

Users can upload or use pre-recorded content, edit it, schedule streams, and broadcast simultaneously to platforms like Facebook, YouTube, and Twitch.

A core part of the solution was a robust media processing pipeline using FFmpeg, enabling:

* Video trimming, filters, transitions, and compression
* Real-time transcoding and format conversion
* Streaming via protocols like RTMP/HLS
* Handling multiple input/output streams efficiently
* Cloud-based media processing
* Multi-source ingestion

---

## **10. Key Features**

* Multi-platform streaming (Facebook, YouTube, Twitch)
* Mobile-first streaming (no bulky tools like OBS)
* Multiple input sources (RTMP, uploads, links, camera, podcasts)
* Direct video link → go live instantly (no manual upload needed)
* 24/7 continuous streaming with loop playback
* Advanced scheduling (automated & recurring streams)

**Video Editing (FFmpeg-powered):**

* Trimming, filters, transitions, compression

* Format conversion & optimization for streaming

* Real-time processing pipeline

* Auto thumbnail generation from video frames using FFmpeg

* Watermark & branding support (logo/text overlay)

* Reels (short-form video creation & editing)

* Web Stories (interactive content format)

* Large file uploads with multipart handling (S3)

* Real-time stream monitoring & status updates

* Push notifications for engagement

---

## **11. Frontend Tech**

* React Native (Bare Workflow – Android & iOS)
* Redux Toolkit + Context API + Zustand
* React Native Reanimated + Skia
* FFmpeg for on-device video processing

---

## **12. Backend Tech**

* N/A

---

## **13. Database**

* MongoDB

---

## **14. Cloud Platform**

* AWS (S3, CloudFront, Lambda)
* Azure Storage

---

## **15. DevOps Tools**

* N/A

---

## **16. AI/ML Used**

* No

---

## **17. AI/ML Details**

* NA

---

## **18. Individual Contribution**

* Initiated project from scratch, including research on FFmpeg-based streaming pipeline

* Implemented Facebook Graph API for live streaming (auth, permissions, stream creation)

* Solved complex Facebook login + permission flow issues in React Native

* Built feature: YouTube video link → directly go live on Facebook using FFmpeg + RTMP

* Integrated YouTube Data API for live streaming workflows

* Handled multi-platform streaming (Facebook + YouTube) with FFmpeg

* Developed video editing engine using FFmpeg (on-device): trim, filters, scaling, rotation

* Built auto thumbnail generation using FFmpeg frame extraction

* Used FFprobe for extracting video metadata

* Implemented camera live streaming (React Native → FFmpeg pipeline)

* Built large file upload system (1GB+), optimized via WebView approach

* Developed Reels and Web Stories features

* Integrated payment gateways (Paytm, Razorpay)

* Integrated Google Ads SDK (rewarded ads)

* Led React Native architecture migration

**Performance Optimizations:**

* Replaced FlatList with FlashList → reduced UI lag
* Migrated to TanStack Query for caching & API efficiency
* Used Zustand + MMKV for fast local storage
* Used Reanimated for smooth animations

---

## **19. Challenges**

* Complex FFmpeg configurations for YouTube streaming
* Handling simultaneous streaming (Facebook + YouTube)
* Implementing 24/7 loop streaming using FFmpeg
* RTMP/FLV compatibility issues
* React Native limitations for camera streaming
* Large file uploads (>1GB) on mobile networks
* Facebook API permission constraints
* Performance bottlenecks in video processing
* React Native architecture migration issues

---

## **20. Solutions**

* Tuned FFmpeg commands for bitrate, GOP, encoding settings
* Fixed RTMP streaming via delay + FLV configuration
* Built abstraction for multi-platform streaming
* Used FFmpeg flags for continuous streaming
* Optimized uploads using multipart + WebView fallback
* Implemented custom permission handling for Facebook APIs
* Used FFprobe for validation

**Performance Improvements:**

* FlashList (reduced UI jank)
* TanStack Query (caching)
* MMKV (fast storage)
* Successful React Native migration

---

## **21. Measurable Results**

* Stable multi-platform streaming (Facebook + YouTube)
* Reduced UI lag after FlashList migration
* Improved API performance via caching
* Reliable large file uploads (>1GB)
* Smooth mobile video editing experience

---

## **22. Business Impact**

* Enabled multi-platform audience reach
* Reduced dependency on external tools
* Increased engagement via Reels & Web Stories
* Automated scheduling reduced manual effort
* Provided scalable infrastructure

---

## **23. Architecture Summary**

* Mobile App → React Native (Android/iOS)
* Backend → Node.js + Java Microservices
* Media pipeline → FFmpeg (encoding, transcoding, streaming)
* Streaming → RTMP
* Storage → AWS S3 / Azure Blob
* CDN → CloudFront
* Real-time → WebSockets

---

## **24. Scalability Improvements**

* Optimized client-side performance (FlashList, MMKV, caching)
* Efficient FFmpeg-based media pipeline
* CDN-based delivery
