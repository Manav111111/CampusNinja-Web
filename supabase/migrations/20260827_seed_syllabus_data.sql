-- ============================================================
-- CAMPUSNINJA — SYLLABUS SEED DATA
-- Idempotent seed function for existing subjects
-- ============================================================

DO $$
DECLARE
  sub RECORD;
  syl_id UUID;
  u1_id UUID;
  u2_id UUID;
  u3_id UUID;
  u4_id UUID;
  u5_id UUID;
  u6_id UUID;
  u7_id UUID;
BEGIN

  -- ==========================================================
  -- 1. APPLIED MATHEMATICS 1
  -- ==========================================================
  FOR sub IN SELECT id FROM subjects WHERE lower(name) LIKE '%applied mathematics%' OR lower(name) LIKE '%mathematics 1%' OR lower(name) LIKE '%math 1%' LOOP
    -- Insert or get syllabus
    INSERT INTO syllabuses (subject_id, file_name, file_url)
    VALUES (sub.id, 'Applied_Mathematics_1_Syllabus.pdf', 'https://drive.google.com')
    ON CONFLICT (subject_id) DO UPDATE SET updated_at = now()
    RETURNING id INTO syl_id;

    -- Only populate if no units currently exist
    IF NOT EXISTS (SELECT 1 FROM syllabus_units WHERE syllabus_id = syl_id) THEN
      -- Unit 1
      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 1, 'Matrices', 1) RETURNING id INTO u1_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u1_id, 'Definition of matrix and types of matrices', 1),
        (u1_id, 'Elementary row and column operations', 2),
        (u1_id, 'Echelon form and Normal form of a matrix', 3),
        (u1_id, 'Rank of a matrix and nullity', 4),
        (u1_id, 'Linear dependence and independence of vectors', 5);

      -- Unit 2
      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 2, 'Determinants', 2) RETURNING id INTO u2_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u2_id, 'Properties of determinants & algebraic evaluation', 1),
        (u2_id, 'Minors, cofactors, and adjoint matrices', 2),
        (u2_id, 'Inverse of a non-singular matrix', 3),
        (u2_id, 'Cramer’s rule for solving linear systems', 4);

      -- Unit 3
      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 3, 'System of Linear Equations', 3) RETURNING id INTO u3_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u3_id, 'Consistency and inconsistency of linear systems', 1),
        (u3_id, 'Homogeneous and non-homogeneous systems', 2),
        (u3_id, 'Gauss elimination method and Gauss-Jordan method', 3),
        (u3_id, 'Eigenvalues, Eigenvectors, and Cayley-Hamilton Theorem', 4);

      -- Unit 4
      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 4, 'Vector Algebra', 4) RETURNING id INTO u4_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u4_id, 'Vectors in 2D & 3D coordinate geometry', 1),
        (u4_id, 'Scalar (dot) product and Vector (cross) product', 2),
        (u4_id, 'Scalar triple product and Vector triple product', 3),
        (u4_id, 'Geometrical and physical applications of vectors', 4);

      -- Unit 5
      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 5, 'Differential Calculus', 5) RETURNING id INTO u5_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u5_id, 'Successive differentiation and Leibnitz’s Theorem', 1),
        (u5_id, 'Partial derivatives and Total derivative', 2),
        (u5_id, 'Euler’s Theorem on homogeneous functions', 3),
        (u5_id, 'Taylor’s and Maclaurin’s series for two variables', 4);

      -- Unit 6
      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 6, 'Integral Calculus', 6) RETURNING id INTO u6_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u6_id, 'Definite integrals and Reduction formulae', 1),
        (u6_id, 'Double and Triple integrals evaluation', 2),
        (u6_id, 'Change of order of integration', 3),
        (u6_id, 'Applications to areas, volumes, and center of gravity', 4);

      -- Unit 7
      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 7, 'Applications of Calculus', 7) RETURNING id INTO u7_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u7_id, 'Tangents, Normals, and Asymptotes', 1),
        (u7_id, 'Curvature, Radius of curvature, and Evolutes', 2),
        (u7_id, 'Maxima and Minima of functions of two variables', 3),
        (u7_id, 'Lagrange’s method of undetermined multipliers', 4);
    END IF;
  END LOOP;

  -- ==========================================================
  -- 2. ENVIRONMENTAL SCIENCE
  -- ==========================================================
  FOR sub IN SELECT id FROM subjects WHERE lower(name) LIKE '%environmental%' LOOP
    INSERT INTO syllabuses (subject_id, file_name, file_url)
    VALUES (sub.id, 'Environmental_Science_Syllabus.pdf', 'https://drive.google.com')
    ON CONFLICT (subject_id) DO UPDATE SET updated_at = now()
    RETURNING id INTO syl_id;

    IF NOT EXISTS (SELECT 1 FROM syllabus_units WHERE syllabus_id = syl_id) THEN
      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 1, 'Ecosystems & Biodiversity', 1) RETURNING id INTO u1_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u1_id, 'Concept of an ecosystem, structure and function of ecosystem', 1),
        (u1_id, 'Producers, consumers, and decomposers in food chain/web', 2),
        (u1_id, 'Biodiversity at global, national, and local levels', 3),
        (u1_id, 'Threats to biodiversity: habitat loss, poaching, man-wildlife conflicts', 4);

      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 2, 'Natural Resources & Management', 2) RETURNING id INTO u2_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u2_id, 'Forest resources: Use, over-exploitation, and deforestation', 1),
        (u2_id, 'Water resources: Use and over-utilization of surface/ground water', 2),
        (u2_id, 'Mineral and Energy resources: Growing energy needs and renewable sources', 3);

      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 3, 'Environmental Pollution & Control', 3) RETURNING id INTO u3_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u3_id, 'Air, Water, and Soil pollution causes, effects, and control measures', 1),
        (u3_id, 'Solid waste management: Causes, effects, and control of urban wastes', 2),
        (u3_id, 'Disaster management: Floods, earthquake, cyclones, and landslides', 3);

      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 4, 'Social Issues & Environmental Ethics', 4) RETURNING id INTO u4_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u4_id, 'From unsustainable to sustainable development', 1),
        (u4_id, 'Water conservation, rain water harvesting, and watershed management', 2),
        (u4_id, 'Environmental protection acts and public awareness', 3);
    END IF;
  END LOOP;

  -- ==========================================================
  -- 3. ENGINEERING GRAPHICS
  -- ==========================================================
  FOR sub IN SELECT id FROM subjects WHERE lower(name) LIKE '%engineering graphics%' OR lower(name) LIKE '%drawing%' LOOP
    INSERT INTO syllabuses (subject_id, file_name, file_url)
    VALUES (sub.id, 'Engineering_Graphics_Syllabus.pdf', 'https://drive.google.com')
    ON CONFLICT (subject_id) DO UPDATE SET updated_at = now()
    RETURNING id INTO syl_id;

    IF NOT EXISTS (SELECT 1 FROM syllabus_units WHERE syllabus_id = syl_id) THEN
      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 1, 'Drafting Principles & Scales', 1) RETURNING id INTO u1_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u1_id, 'Drawing instruments, sheet layout, and standard lettering', 1),
        (u1_id, 'Dimensioning techniques and geometric constructions', 2),
        (u1_id, 'Plain scales, diagonal scales, and vernier scales', 3);

      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 2, 'Engineering Curves & Conics', 2) RETURNING id INTO u2_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u2_id, 'Conic sections: Ellipse, Parabola, and Hyperbola constructions', 1),
        (u2_id, 'Cycloidal curves: Cycloid, Epicycloid, and Hypocycloid', 2),
        (u2_id, 'Involutes of regular polygons and circles', 3);

      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 3, 'Orthographic Projections', 3) RETURNING id INTO u3_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u3_id, 'First angle and Third angle projection principles', 1),
        (u3_id, 'Projections of points in all four quadrants', 2),
        (u3_id, 'Projections of straight lines inclined to both reference planes', 3);

      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 4, 'Projections & Section of Solids', 4) RETURNING id INTO u4_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u4_id, 'Projections of prisms, pyramids, cylinders, and cones', 1),
        (u4_id, 'Section planes and true shape of sections', 2),
        (u4_id, 'Development of lateral surfaces of simple solids', 3);

      INSERT INTO syllabus_units (syllabus_id, subject_id, unit_number, title, sort_order)
      VALUES (syl_id, sub.id, 5, 'Isometric Projections & CAD', 5) RETURNING id INTO u5_id;
      INSERT INTO syllabus_topics (unit_id, title, sort_order) VALUES
        (u5_id, 'Isometric scale, isometric axes, and isometric views', 1),
        (u5_id, 'Conversion of orthographic views into isometric views', 2),
        (u5_id, 'Basic AutoCAD commands and 2D drafting workflow', 3);
    END IF;
  END LOOP;

END $$;
