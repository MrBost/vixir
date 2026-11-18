-- Vixir initial schema — mirrors .kiro/steering/data-model.md. Change both together.

CREATE TABLE institution (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text NOT NULL,
    country     text NOT NULL DEFAULT 'NG',
    region      text,
    type        text NOT NULL CHECK (type IN ('SECONDARY','POLYTECHNIC','UNIVERSITY','OTHER')),
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE institution_settings (
    institution_id           uuid PRIMARY KEY REFERENCES institution(id) ON DELETE CASCADE,
    vix_enabled              boolean NOT NULL DEFAULT true,
    vix_transcripts_retained boolean NOT NULL DEFAULT false,
    default_noise_level      text NOT NULL DEFAULT 'REALISTIC' CHECK (default_noise_level IN ('IDEAL','LOW','REALISTIC','HARSH')),
    default_locale           text NOT NULL DEFAULT 'en'
);

CREATE TABLE app_user (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  uuid REFERENCES institution(id),
    email           text UNIQUE,
    matric_no       text,
    password_hash   text,
    google_sub      text UNIQUE,
    first_name      text NOT NULL,
    last_name       text NOT NULL DEFAULT '',
    role            text NOT NULL CHECK (role IN ('STUDENT','TEACHER','ADMIN')),
    status          text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','DISABLED')),
    locale          text NOT NULL DEFAULT 'en',
    created_at      timestamptz NOT NULL DEFAULT now(),
    last_login_at   timestamptz,
    CONSTRAINT app_user_login_present CHECK (email IS NOT NULL OR matric_no IS NOT NULL)
);
CREATE UNIQUE INDEX app_user_matric_uq ON app_user (institution_id, matric_no) WHERE matric_no IS NOT NULL;

CREATE TABLE refresh_token (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    token_hash  text NOT NULL UNIQUE,
    family_id   uuid NOT NULL,
    expires_at  timestamptz NOT NULL,
    revoked_at  timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX refresh_token_user_idx ON refresh_token (user_id);
CREATE INDEX refresh_token_family_idx ON refresh_token (family_id);

CREATE TABLE school_class (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  uuid NOT NULL REFERENCES institution(id),
    owner_id        uuid NOT NULL REFERENCES app_user(id),
    name            text NOT NULL,
    subject         text NOT NULL CHECK (subject IN ('PHYSICS','CHEMISTRY','BIOLOGY','ELECTRONICS','ENGINEERING','SCIENCE')),
    level           text NOT NULL CHECK (level IN ('SS1','SS2','SS3','ND','HND','100L','200L','OTHER')),
    join_code       text NOT NULL,
    archived_at     timestamptz,
    created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX school_class_join_code_uq ON school_class (upper(join_code));

CREATE TABLE enrolment (
    class_id    uuid NOT NULL REFERENCES school_class(id) ON DELETE CASCADE,
    user_id     uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    class_role  text NOT NULL DEFAULT 'STUDENT' CHECK (class_role IN ('STUDENT','CO_TEACHER')),
    joined_at   timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (class_id, user_id)
);
CREATE INDEX enrolment_user_idx ON enrolment (user_id);

CREATE TABLE experiment (
    id                        text PRIMARY KEY,
    subject                   text NOT NULL CHECK (subject IN ('PHYSICS','CHEMISTRY','BIOLOGY','ELECTRONICS','ENGINEERING')),
    title                     text NOT NULL,
    latest_published_version  int
);

CREATE TABLE experiment_version (
    experiment_id  text NOT NULL REFERENCES experiment(id),
    version        int NOT NULL,
    status         text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','PUBLISHED','RETIRED')),
    config         jsonb NOT NULL,
    curricula      text[] NOT NULL DEFAULT '{}',
    level          text[] NOT NULL DEFAULT '{}',
    author_id      uuid REFERENCES app_user(id),
    published_at   timestamptz,
    PRIMARY KEY (experiment_id, version)
);

CREATE TABLE rubric (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id  text NOT NULL,
    version        int NOT NULL,
    criteria       jsonb NOT NULL,
    max_total      int NOT NULL CHECK (max_total > 0),
    UNIQUE (experiment_id, version),
    FOREIGN KEY (experiment_id, version) REFERENCES experiment_version(experiment_id, version)
);

CREATE TABLE assignment (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id            uuid NOT NULL REFERENCES school_class(id),
    experiment_id       text NOT NULL,
    experiment_version  int NOT NULL,
    created_by          uuid NOT NULL REFERENCES app_user(id),
    mode                text NOT NULL CHECK (mode IN ('PRACTICE','GRADED','EXAM')),
    status              text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','PUBLISHED','CLOSED')),
    instructions        text,
    noise_level         text NOT NULL DEFAULT 'REALISTIC' CHECK (noise_level IN ('IDEAL','LOW','REALISTIC','HARSH')),
    attempts_allowed    int NOT NULL DEFAULT 2 CHECK (attempts_allowed >= 0),
    release_policy      text NOT NULL DEFAULT 'MANUAL' CHECK (release_policy IN ('AUTO','MANUAL')),
    opens_at            timestamptz NOT NULL,
    due_at              timestamptz NOT NULL,
    created_at          timestamptz NOT NULL DEFAULT now(),
    CHECK (due_at > opens_at),
    FOREIGN KEY (experiment_id, experiment_version) REFERENCES experiment_version(experiment_id, version)
);
CREATE INDEX assignment_class_idx ON assignment (class_id, due_at);

CREATE TABLE attempt (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              uuid REFERENCES app_user(id),
    assignment_id        uuid REFERENCES assignment(id),
    experiment_id        text NOT NULL,
    experiment_version   int NOT NULL,
    mode                 text NOT NULL CHECK (mode IN ('PRACTICE','GRADED','EXAM')),
    attempt_no           int NOT NULL DEFAULT 1,
    seed                 bytea NOT NULL,
    state                text NOT NULL DEFAULT 'IN_PROGRESS' CHECK (state IN ('IN_PROGRESS','SUBMITTED','MARKED','RELEASED','ABANDONED')),
    last_event_seq       int NOT NULL DEFAULT 0,
    device_id            uuid,
    anon_token_hash      text,
    started_at           timestamptz NOT NULL DEFAULT now(),
    submitted_at         timestamptz,
    client_submitted_at  timestamptz,
    FOREIGN KEY (experiment_id, experiment_version) REFERENCES experiment_version(experiment_id, version)
);
CREATE INDEX attempt_assignment_user_idx ON attempt (assignment_id, user_id);
CREATE UNIQUE INDEX attempt_no_uq ON attempt (assignment_id, user_id, attempt_no) WHERE assignment_id IS NOT NULL;

CREATE TABLE attempt_event (
    id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    attempt_id       uuid NOT NULL REFERENCES attempt(id) ON DELETE CASCADE,
    client_event_id  uuid NOT NULL,
    seq              int NOT NULL,
    type             text NOT NULL,
    payload          jsonb NOT NULL DEFAULT '{}',
    sim_time_ms      bigint,
    client_ts        timestamptz,
    server_ts        timestamptz NOT NULL DEFAULT now(),
    UNIQUE (attempt_id, client_event_id),
    UNIQUE (attempt_id, seq)
);

CREATE TABLE reading (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id   uuid NOT NULL REFERENCES attempt(id) ON DELETE CASCADE,
    row_index    int NOT NULL,
    "values"     jsonb NOT NULL,
    flags        text[] NOT NULL DEFAULT '{}',
    recorded_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (attempt_id, row_index)
);

CREATE TABLE submission (
    id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id            uuid NOT NULL UNIQUE REFERENCES attempt(id),
    results               jsonb NOT NULL,
    readings_hash         text NOT NULL,
    declaration_accepted  boolean NOT NULL CHECK (declaration_accepted),
    late                  boolean NOT NULL DEFAULT false,
    idempotency_key       text,
    submitted_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX submission_readings_hash_idx ON submission (readings_hash);

CREATE TABLE mark (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id    uuid NOT NULL UNIQUE REFERENCES submission(id) ON DELETE CASCADE,
    total            int NOT NULL CHECK (total >= 0),
    max_total        int NOT NULL CHECK (max_total > 0),
    marker_version   text NOT NULL,
    teacher_comment  text,
    reviewed_by      uuid REFERENCES app_user(id),
    marked_at        timestamptz NOT NULL DEFAULT now(),
    released_at      timestamptz,
    CHECK (total <= max_total)
);

CREATE TABLE mark_criterion (
    mark_id        uuid NOT NULL REFERENCES mark(id) ON DELETE CASCADE,
    criterion_key  text NOT NULL,
    awarded        int NOT NULL CHECK (awarded >= 0),
    max            int NOT NULL CHECK (max > 0),
    reason         text NOT NULL,
    overridden     boolean NOT NULL DEFAULT false,
    PRIMARY KEY (mark_id, criterion_key),
    CHECK (awarded <= max)
);

CREATE TABLE review_flag (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id  uuid NOT NULL REFERENCES submission(id) ON DELETE CASCADE,
    type           text NOT NULL CHECK (type IN ('OUTLIER_RESULT','DUPLICATE_READINGS','LATE_OFFLINE','MANUAL')),
    detail         jsonb NOT NULL DEFAULT '{}',
    status         text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','RESOLVED')),
    resolved_by    uuid REFERENCES app_user(id),
    created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX review_flag_submission_idx ON review_flag (submission_id);

CREATE TABLE vix_session (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              uuid NOT NULL REFERENCES app_user(id),
    attempt_id           uuid REFERENCES attempt(id),
    room                 text NOT NULL,
    mode                 text NOT NULL CHECK (mode IN ('PRACTICE','GRADED')),
    consent              jsonb NOT NULL,
    voice                text NOT NULL DEFAULT 'ada',
    locale               text NOT NULL DEFAULT 'en',
    turns                int NOT NULL DEFAULT 0,
    transcript_retained  boolean NOT NULL DEFAULT false,
    started_at           timestamptz NOT NULL DEFAULT now(),
    ended_at             timestamptz
);

CREATE TABLE vix_message (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vix_session_id  uuid NOT NULL REFERENCES vix_session(id) ON DELETE CASCADE,
    role            text NOT NULL CHECK (role IN ('STUDENT','VIX')),
    text            text NOT NULL,
    policy_blocked  boolean NOT NULL DEFAULT false,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_id     uuid REFERENCES app_user(id),
    action       text NOT NULL,
    entity_type  text NOT NULL,
    entity_id    text NOT NULL,
    detail       jsonb NOT NULL DEFAULT '{}',
    created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_log_actor_idx ON audit_log (actor_id, created_at);
