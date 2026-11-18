---
inclusion: fileMatch
fileMatchPattern: "apps/api/**,apps/vix-agent/**,apps/web/src/api/**"
---
# Vixir data model (source of truth for the database)

Postgres. All ids are UUID v7 unless noted. All timestamps are `timestamptz` in UTC. Enums are Postgres `text` with CHECK constraints (easier Flyway changes). Soft delete only where stated.

```mermaid
erDiagram
    INSTITUTION ||--o{ APP_USER : has
    INSTITUTION ||--|| INSTITUTION_SETTINGS : configures
    INSTITUTION ||--o{ SCHOOL_CLASS : runs
    APP_USER ||--o{ REFRESH_TOKEN : holds
    APP_USER ||--o{ SCHOOL_CLASS : "owns (teacher)"
    SCHOOL_CLASS ||--o{ ENROLMENT : has
    APP_USER ||--o{ ENROLMENT : "is enrolled"
    EXPERIMENT ||--o{ EXPERIMENT_VERSION : versions
    EXPERIMENT_VERSION ||--|| RUBRIC : "marked by"
    SCHOOL_CLASS ||--o{ ASSIGNMENT : receives
    EXPERIMENT_VERSION ||--o{ ASSIGNMENT : "assigned as"
    APP_USER ||--o{ ASSIGNMENT : "created by"
    ASSIGNMENT ||--o{ ATTEMPT : "attempted in"
    APP_USER ||--o{ ATTEMPT : makes
    EXPERIMENT_VERSION ||--o{ ATTEMPT : "runs"
    ATTEMPT ||--o{ ATTEMPT_EVENT : logs
    ATTEMPT ||--o{ READING : records
    ATTEMPT ||--o| SUBMISSION : "ends in"
    SUBMISSION ||--o| MARK : "is marked"
    MARK ||--o{ MARK_CRITERION : "broken into"
    SUBMISSION ||--o{ REVIEW_FLAG : raises
    APP_USER ||--o{ VIX_SESSION : opens
    ATTEMPT ||--o{ VIX_SESSION : "helped by"
    VIX_SESSION ||--o{ VIX_MESSAGE : "may retain"
    APP_USER ||--o{ AUDIT_LOG : "acts in"

    INSTITUTION {
        uuid id PK
        text name
        text country "ISO 3166-1 alpha-2, e.g. NG"
        text region
        text type "SECONDARY|POLYTECHNIC|UNIVERSITY|OTHER"
        timestamptz created_at
    }
    INSTITUTION_SETTINGS {
        uuid institution_id PK,FK
        boolean vix_enabled
        boolean vix_transcripts_retained
        text default_noise_level "IDEAL|LOW|REALISTIC|HARSH"
        text default_locale "en|pcm|yo|ha|ig|fr"
    }
    APP_USER {
        uuid id PK
        uuid institution_id FK "nullable for anonymous practice"
        text email UK "nullable for students created by CSV with matric_no"
        text matric_no "unique within institution, nullable"
        text password_hash "argon2id, nullable when Google only"
        text google_sub UK "nullable"
        text first_name
        text last_name
        text role "STUDENT|TEACHER|ADMIN"
        text status "ACTIVE|DISABLED"
        text locale
        timestamptz created_at
        timestamptz last_login_at
    }
    REFRESH_TOKEN {
        uuid id PK
        uuid user_id FK
        text token_hash UK "sha-256 of the token"
        uuid family_id "rotation family; reuse revokes family"
        timestamptz expires_at
        timestamptz revoked_at
        timestamptz created_at
    }
    SCHOOL_CLASS {
        uuid id PK
        uuid institution_id FK
        uuid owner_id FK "teacher"
        text name "SS3A Physics"
        text subject "PHYSICS|CHEMISTRY|BIOLOGY|ELECTRONICS|ENGINEERING|SCIENCE"
        text level "SS1|SS2|SS3|ND|HND|100L|200L|OTHER"
        text join_code UK "e.g. PHY-SS3-7KQ2"
        timestamptz archived_at
        timestamptz created_at
    }
    ENROLMENT {
        uuid class_id PK,FK
        uuid user_id PK,FK
        text class_role "STUDENT|CO_TEACHER"
        timestamptz joined_at
    }
    EXPERIMENT {
        text id PK "slug, e.g. phy.pendulum.g"
        text subject
        text title
        int latest_published_version
    }
    EXPERIMENT_VERSION {
        text experiment_id PK,FK
        int version PK
        text status "DRAFT|PUBLISHED|RETIRED"
        jsonb config "validated against experiment.schema.json"
        text[] curricula "waec|neco|nuc|nbte"
        text level
        uuid author_id FK "nullable for core experiments"
        timestamptz published_at
    }
    RUBRIC {
        uuid id PK
        text experiment_id FK
        int version FK
        jsonb criteria "[{key,label,max,rule}]"
        int max_total
    }
    ASSIGNMENT {
        uuid id PK
        uuid class_id FK
        text experiment_id FK
        int experiment_version FK
        uuid created_by FK
        text mode "PRACTICE|GRADED|EXAM"
        text status "DRAFT|PUBLISHED|CLOSED"
        text instructions
        text noise_level
        int attempts_allowed "0 = unlimited"
        text release_policy "AUTO|MANUAL"
        timestamptz opens_at
        timestamptz due_at
        timestamptz created_at
    }
    ATTEMPT {
        uuid id PK
        uuid user_id FK "nullable for anonymous landing-page practice"
        uuid assignment_id FK "nullable for free practice"
        text experiment_id FK
        int experiment_version FK
        text mode
        int attempt_no
        bytea seed "16 random bytes"
        text state "IN_PROGRESS|SUBMITTED|MARKED|RELEASED|ABANDONED"
        int last_event_seq
        uuid device_id
        timestamptz started_at
        timestamptz submitted_at "server receive time"
        timestamptz client_submitted_at "device time, for offline"
    }
    ATTEMPT_EVENT {
        bigint id PK "identity"
        uuid attempt_id FK
        uuid client_event_id "UK with attempt_id: idempotency"
        int seq "client order, gapless per attempt"
        text type "APPARATUS_PLACED|CONTROL_CHANGED|INSTRUMENT_STARTED|INSTRUMENT_STOPPED|READING_RECORDED|WARNING|VIX_CALLED|..."
        jsonb payload
        bigint sim_time_ms
        timestamptz client_ts
        timestamptz server_ts
    }
    READING {
        uuid id PK
        uuid attempt_id FK
        int row_index
        jsonb values "{L_cm:60.0, t_s:31.27, n:20}"
        text[] flags "OSC_COUNT|PARALLAX|OVERSHOOT|UNSETTLED"
        timestamptz recorded_at
    }
    SUBMISSION {
        uuid id PK
        uuid attempt_id FK,UK
        jsonb results "table rows, graph points, slope points, derived value, precautions"
        text readings_hash "sha-256 of normalised readings, for duplicate detection"
        boolean declaration_accepted
        boolean late
        timestamptz submitted_at
    }
    MARK {
        uuid id PK
        uuid submission_id FK,UK
        int total
        int max_total
        text marker_version
        text teacher_comment
        uuid reviewed_by FK
        timestamptz marked_at
        timestamptz released_at
    }
    MARK_CRITERION {
        uuid mark_id PK,FK
        text criterion_key PK
        int awarded
        int max
        text reason
        boolean overridden
    }
    REVIEW_FLAG {
        uuid id PK
        uuid submission_id FK
        text type "OUTLIER_RESULT|DUPLICATE_READINGS|LATE_OFFLINE|MANUAL"
        jsonb detail
        text status "OPEN|RESOLVED"
        uuid resolved_by FK
        timestamptz created_at
    }
    VIX_SESSION {
        uuid id PK
        uuid user_id FK
        uuid attempt_id FK "nullable (hub, encyclopedia)"
        text room "LiveKit room name"
        text mode "PRACTICE|GRADED (never EXAM)"
        jsonb consent "{mic, screen, camera}"
        text voice
        text locale
        int turns
        boolean transcript_retained
        timestamptz started_at
        timestamptz ended_at
    }
    VIX_MESSAGE {
        uuid id PK
        uuid vix_session_id FK
        text role "STUDENT|VIX"
        text text
        boolean policy_blocked
        timestamptz created_at
    }
    AUDIT_LOG {
        bigint id PK
        uuid actor_id FK
        text action "e.g. MARK_OVERRIDDEN, USER_DISABLED"
        text entity_type
        text entity_id
        jsonb detail
        timestamptz created_at
    }
```

## Key constraints and indexes
- `enrolment` PK (class_id, user_id); index (user_id).
- `attempt_event` UNIQUE (attempt_id, client_event_id); UNIQUE (attempt_id, seq); index (attempt_id, seq).
- `attempt` index (assignment_id, user_id); partial UNIQUE (assignment_id, user_id, attempt_no).
- `submission.readings_hash` index, used to find identical readings within one assignment.
- `school_class.join_code` UNIQUE, case-insensitive (citext or upper()).
- `app_user` UNIQUE (institution_id, matric_no) where matric_no is not null.
- Students are never deleted while they have submissions; admins disable them (status DISABLED). Data export and hard delete are admin actions recorded in audit_log.
