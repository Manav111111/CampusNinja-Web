-- ============================================================
-- CAMPUSNINJA — DYNAMIC SYLLABUS SYSTEM
-- Production-Ready Supabase Migration
-- Tables: syllabuses, syllabus_units, syllabus_topics
-- ============================================================

-- 1. SYLLABUSES TABLE
CREATE TABLE IF NOT EXISTS syllabuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  file_url TEXT,
  file_name TEXT,
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_syllabuses_subject UNIQUE (subject_id)
);

CREATE INDEX IF NOT EXISTS idx_syllabuses_subject_id ON syllabuses (subject_id);

-- 2. SYLLABUS_UNITS TABLE
CREATE TABLE IF NOT EXISTS syllabus_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  syllabus_id UUID NOT NULL REFERENCES syllabuses(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  unit_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_syllabus_units_syllabus_id ON syllabus_units (syllabus_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_units_subject_id ON syllabus_units (subject_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_units_sort_order ON syllabus_units (sort_order ASC);

-- 3. SYLLABUS_TOPICS TABLE
CREATE TABLE IF NOT EXISTS syllabus_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES syllabus_units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_syllabus_topics_unit_id ON syllabus_topics (unit_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_topics_sort_order ON syllabus_topics (sort_order ASC);

-- 4. RLS
ALTER TABLE syllabuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus_topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "syllabuses_public_read" ON syllabuses;
CREATE POLICY "syllabuses_public_read" ON syllabuses FOR SELECT USING (true);

DROP POLICY IF EXISTS "syllabus_units_public_read" ON syllabus_units;
CREATE POLICY "syllabus_units_public_read" ON syllabus_units FOR SELECT USING (true);

DROP POLICY IF EXISTS "syllabus_topics_public_read" ON syllabus_topics;
CREATE POLICY "syllabus_topics_public_read" ON syllabus_topics FOR SELECT USING (true);

DROP POLICY IF EXISTS "syllabuses_admin_write" ON syllabuses;
CREATE POLICY "syllabuses_admin_write" ON syllabuses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "syllabus_units_admin_write" ON syllabus_units;
CREATE POLICY "syllabus_units_admin_write" ON syllabus_units FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "syllabus_topics_admin_write" ON syllabus_topics;
CREATE POLICY "syllabus_topics_admin_write" ON syllabus_topics FOR ALL USING (true) WITH CHECK (true);
