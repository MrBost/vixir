# Requirements Document

## Introduction
**Feature:** Offline PWA and sync (P1)

Students on weak or no internet can install Vixir, download practicals and run them offline; attempts sync later (I1, I2).

## Glossary
- **Platform**: the installed web app plus the API.
- **Outbox**: IndexedDB queue of unsent attempt events and submissions.
- **Download**: cached app shell, experiment config and assets for one assignment.

## Requirements

### Requirement 1 — Install and download
**User Story:** As a student with expensive data, I want to download practicals once and use them offline.
#### Acceptance Criteria
1. THE Platform SHALL be installable as a PWA on Android Chrome.
2. WHEN the student downloads an Assignment THE Platform SHALL cache its app shell, experiment config and assets and show the download size.
3. WHILE offline THE Platform SHALL run any downloaded practical in full, including marking preview in practice mode.

### Requirement 2 — Sync
**User Story:** As a student, I want my offline work to reach my teacher automatically.
#### Acceptance Criteria
1. WHILE offline THE Platform SHALL store attempts and events in IndexedDB in an outbox.
2. WHEN connectivity returns THE Platform SHALL upload the outbox in order and mark items synced.
3. IF an offline submission reaches the server after the due time THEN THE Platform SHALL accept it when its recorded submit time is before the due time, and flag it for the teacher.
4. THE Platform SHALL show a sync status indicator (synced / offline / syncing).
