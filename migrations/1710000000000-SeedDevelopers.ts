import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDevelopers1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Insert Media records for intro videos (you'll update URLs manually)
    await queryRunner.query(`
      INSERT INTO media (id, type, url, "processingStatus", "createdAt", "updatedAt") VALUES
      ('11111111-0001-4000-8000-000000000001', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133298/ssstik.io__umacodes_1773132716022_lecytt.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000002', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133298/ssstik.io__transferpilot_1773133201258_gtfrog.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000003', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133297/ssstik.io__webappcode_1773132670025_zctbvk.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000004', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133297/ssstik.io__tembrasdev_1773133174147_oiz2op.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000005', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133296/ssstik.io__educativeinc_1773132856207_la7yzn.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000006', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133296/ssstik.io__mystic.js_1773132588805_xgnya4.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000007', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133296/ssstik.io__quick_code_01_1773132895725_gdoy5m.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000008', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133295/ssstik.io__kodekloud_1773132933228_p3mkpq.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000009', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133295/ssstik.io__freecodecamp_1773133225172_ifyfsi.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000010', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133294/ssstik.io__hello.interview_1773133146141_w918tb.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000011', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133294/ssstik.io__hellouileo_1773133073749_pexhij.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000012', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133294/ssstik.io__khalil_developer_1773132787514_c2wpjt.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000013', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133292/ssstik.io__coding.kitty7_1773132764156_b9nuoi.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000014', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133292/ssstik.io__david.webdeveloper_1772785043386_bc8d96.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000015', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133292/ssstik.io__clearsquare_1773132816053_jqwwwg.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000016', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133292/ssstik.io__bahamas10__1773133024527_ecslkh.mp4', 'Ready', NOW(), NOW()),
      ('11111111-0001-4000-8000-000000000017', 'Video', 'https://res.cloudinary.com/dv9imdnu9/video/upload/v1773133292/ssstik.io__amazonwebservices_1773132961838_kz9qix.mp4', 'Ready', NOW(), NOW())
    `);

    // Insert Media records for profile photos (you'll update URLs manually)
    await queryRunner.query(`
      INSERT INTO media (id, type, url, "processingStatus", "createdAt", "updatedAt") VALUES
      ('33333333-0001-4000-8000-000000000001', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132385/044141a3-607e-410b-8614-5693a3abaa7b_jasgj3.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000002', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132385/f7c5e9d1-2f80-4d69-aba1-c127992e36d3_rualwf.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000003', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132385/eb4d1c93-cf79-4c20-8952-9056a3aacae2_rdbno6.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000004', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132385/b2245b43-a3aa-49ed-bf83-d4b69a28df15_ya7ukh.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000005', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132385/ccf0b04e-752b-44e7-a5b8-c49bcfa0b24b_s68723.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000006', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132385/ac5809bd-01af-4957-8e48-9dd32fa5358f_avo7qx.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000007', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132384/6293e25f-e92f-4eea-b2a4-499499dc06c4_ytaohk.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000008', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132384/8979499b-e280-4b9a-ab6c-4e349f2b766d_omt858.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000009', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132384/5904d32b-876f-4aee-b5b2-06bd242ef259_ezbbef.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000010', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132384/511aeaef-e330-45ca-9cbb-fd8e7110f087_ftnckn.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000011', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132384/158e3645-a1bd-4c3b-abaa-086d671d9021_f7izic.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000012', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132383/3d0bf01c-05e7-499d-810d-0e4e96fda6ed_elxygm.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000013', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132383/9df43728-0f5c-4c62-ac89-9a7a617e2a16_woe4in.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000014', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132383/58a5f6e4-b358-4d8c-ab5b-bfa2a9f683d6_yp7d3e.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000015', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132383/5fbe5eaf-88e2-430f-b032-64e4c014a7ae_tuyhez.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000016', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132383/8cd70afd-9c9c-4fd8-991a-6c088fc544c2_i4v9u7.jpg', 'Ready', NOW(), NOW()),
      ('33333333-0001-4000-8000-000000000017', 'Image', 'https://res.cloudinary.com/dv9imdnu9/image/upload/v1773132383/9eadfa8d-bec1-4645-adc9-ccdea65553e2_dnbk3t.jpg', 'Ready', NOW(), NOW())
    `);

    // Insert Users
    await queryRunner.query(`
      INSERT INTO "user" (id, "auth0Id", email, "firstName", "lastName", role, status, "createdAt", "updatedAt") VALUES
      ('aaaaaaaa-0001-4000-8000-000000000001', 'auth0|seed_marcus_chen', 'marcus.chen.dev@gmail.com', 'Marcus', 'Chen', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000002', 'auth0|seed_sarah_johnson', 'sarah.j.designs@outlook.com', 'Sarah', 'Johnson', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000003', 'auth0|seed_alex_rivera', 'arivera.backend@gmail.com', 'Alex', 'Rivera', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000004', 'auth0|seed_emma_thompson', 'emma.t.devops@protonmail.com', 'Emma', 'Thompson', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000005', 'auth0|seed_james_kim', 'jameskim.mobile@gmail.com', 'James', 'Kim', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000006', 'auth0|seed_olivia_martinez', 'olivia.martinez.data@outlook.com', 'Olivia', 'Martinez', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000007', 'auth0|seed_daniel_patel', 'danielpatel.dev@gmail.com', 'Daniel', 'Patel', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000008', 'auth0|seed_sofia_andersson', 'sofia.andersson@protonmail.com', 'Sofia', 'Andersson', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000009', 'auth0|seed_michael_oconnor', 'moconnor.security@gmail.com', 'Michael', 'O''Connor', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000010', 'auth0|seed_yuki_tanaka', 'yuki.tanaka.ml@outlook.com', 'Yuki', 'Tanaka', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000011', 'auth0|seed_lucas_schmidt', 'lucas.schmidt.web3@protonmail.com', 'Lucas', 'Schmidt', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000012', 'auth0|seed_amara_okafor', 'amara.okafor.ios@gmail.com', 'Amara', 'Okafor', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000013', 'auth0|seed_ryan_murphy', 'ryan.murphy.platform@outlook.com', 'Ryan', 'Murphy', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000014', 'auth0|seed_nina_volkov', 'nina.volkov.ts@gmail.com', 'Nina', 'Volkov', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000015', 'auth0|seed_carlos_mendez', 'carlos.mendez.java@outlook.com', 'Carlos', 'Mendez', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000016', 'auth0|seed_hannah_lee', 'hannahlee.qa@gmail.com', 'Hannah', 'Lee', 'Developer', 'Active', NOW(), NOW()),
      ('aaaaaaaa-0001-4000-8000-000000000017', 'auth0|seed_david_wright', 'david.wright.eng@protonmail.com', 'David', 'Wright', 'Developer', 'Active', NOW(), NOW())
    `);

    // Insert Developers
    await queryRunner.query(`
      INSERT INTO developer (
        id, "userId", "firstName", "lastName", "jobTitle", location, "seniorityLevel",
        "techStack", "githubUrl", "linkedinUrl", "personalSiteUrl", bio,
        "availabilityStatus", "profilePhotoId", "introVideoId", "onboardingCompleted", "createdAt", "updatedAt"
      ) VALUES
      (
        'bbbbbbbb-0001-4000-8000-000000000001',
        'aaaaaaaa-0001-4000-8000-000000000001',
        'Marcus', 'Chen',
        'Senior Full Stack Engineer',
        'San Francisco, CA',
        'senior',
        ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'GraphQL'],
        'https://github.com',
        'https://linkedin.com',
        'https://google.com',
        'Full stack engineer with 6 years of experience building scalable web applications. Previously at Stripe and Airbnb. Passionate about developer tools and clean architecture. I love solving complex problems and mentoring junior developers.',
        'Available',
        '33333333-0001-4000-8000-000000000001',
        '11111111-0001-4000-8000-000000000001',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000002',
        'aaaaaaaa-0001-4000-8000-000000000002',
        'Sarah', 'Johnson',
        'Frontend Architect',
        'New York, NY',
        'lead',
        ARRAY['React', 'Vue.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Figma'],
        'https://github.com',
        'https://linkedin.com',
        'https://google.com',
        'Frontend architect specializing in design systems and component libraries. 9 years in the industry, currently leading the frontend team at a Series B startup. I bridge the gap between design and engineering.',
        'OpenToOffers',
        '33333333-0001-4000-8000-000000000002',
        '11111111-0001-4000-8000-000000000002',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000003',
        'aaaaaaaa-0001-4000-8000-000000000003',
        'Alex', 'Rivera',
        'Backend Engineer',
        'Austin, TX',
        'mid',
        ARRAY['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
        'https://github.com',
        'https://linkedin.com',
        NULL,
        'Backend developer focused on building robust APIs and microservices. 3 years of experience working with Python ecosystems. Currently diving deep into distributed systems and event-driven architecture.',
        'Available',
        '33333333-0001-4000-8000-000000000003',
        '11111111-0001-4000-8000-000000000003',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000004',
        'aaaaaaaa-0001-4000-8000-000000000004',
        'Emma', 'Thompson',
        'DevOps Engineer',
        'Seattle, WA',
        'senior',
        ARRAY['Kubernetes', 'Terraform', 'AWS', 'GCP', 'Docker', 'CI/CD', 'Go'],
        'https://github.com',
        'https://linkedin.com',
        'https://google.com',
        'DevOps engineer passionate about infrastructure as code and cloud-native technologies. 5 years of experience helping teams ship faster and more reliably. AWS and GCP certified.',
        'NotAvailable',
        '33333333-0001-4000-8000-000000000004',
        '11111111-0001-4000-8000-000000000004',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000005',
        'aaaaaaaa-0001-4000-8000-000000000005',
        'James', 'Kim',
        'Mobile Developer',
        'Los Angeles, CA',
        'mid',
        ARRAY['React Native', 'Swift', 'Kotlin', 'TypeScript', 'Firebase'],
        'https://github.com',
        'https://linkedin.com',
        NULL,
        'Mobile developer with expertise in cross-platform development. Built apps with millions of downloads. 4 years of experience creating smooth, performant mobile experiences for iOS and Android.',
        'Available',
        '33333333-0001-4000-8000-000000000005',
        '11111111-0001-4000-8000-000000000005',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000006',
        'aaaaaaaa-0001-4000-8000-000000000006',
        'Olivia', 'Martinez',
        'Data Engineer',
        'Chicago, IL',
        'senior',
        ARRAY['Python', 'Spark', 'Airflow', 'Snowflake', 'dbt', 'SQL'],
        'https://github.com',
        'https://linkedin.com',
        NULL,
        'Data engineer building scalable data pipelines and analytics infrastructure. 6 years of experience transforming raw data into actionable insights. Previously at Uber working on real-time analytics.',
        'OpenToOffers',
        '33333333-0001-4000-8000-000000000006',
        '11111111-0001-4000-8000-000000000006',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000007',
        'aaaaaaaa-0001-4000-8000-000000000007',
        'Daniel', 'Patel',
        'Junior Full Stack Developer',
        'Denver, CO',
        'junior',
        ARRAY['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
        'https://github.com',
        'https://linkedin.com',
        NULL,
        'Recent bootcamp graduate eager to grow as a full stack developer. Strong foundation in JavaScript and React. Quick learner with a passion for building user-friendly applications.',
        'Available',
        '33333333-0001-4000-8000-000000000007',
        '11111111-0001-4000-8000-000000000007',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000008',
        'aaaaaaaa-0001-4000-8000-000000000008',
        'Sofia', 'Andersson',
        'Principal Engineer',
        'Remote (Europe)',
        'principal',
        ARRAY['Rust', 'Go', 'C++', 'Distributed Systems', 'Kafka', 'gRPC'],
        'https://github.com',
        'https://linkedin.com',
        'https://google.com',
        'Principal engineer with 14 years of experience in systems programming. Expert in building high-performance, distributed systems. Open source contributor and conference speaker.',
        'OpenToOffers',
        '33333333-0001-4000-8000-000000000008',
        '11111111-0001-4000-8000-000000000008',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000009',
        'aaaaaaaa-0001-4000-8000-000000000009',
        'Michael', 'O''Connor',
        'Security Engineer',
        'Boston, MA',
        'senior',
        ARRAY['Python', 'Go', 'AWS Security', 'Penetration Testing', 'SIEM'],
        'https://github.com',
        'https://linkedin.com',
        NULL,
        'Security engineer focused on application security and cloud infrastructure protection. 7 years of experience in offensive and defensive security. OSCP and AWS Security certified.',
        'NotAvailable',
        '33333333-0001-4000-8000-000000000009',
        '11111111-0001-4000-8000-000000000009',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000010',
        'aaaaaaaa-0001-4000-8000-000000000010',
        'Yuki', 'Tanaka',
        'Machine Learning Engineer',
        'Tokyo, Japan',
        'mid',
        ARRAY['Python', 'PyTorch', 'TensorFlow', 'MLOps', 'AWS SageMaker', 'SQL'],
        'https://github.com',
        'https://linkedin.com',
        NULL,
        'ML engineer specializing in NLP and recommendation systems. 4 years of experience deploying models to production. Published researcher with a focus on efficient transformer architectures.',
        'Available',
        '33333333-0001-4000-8000-000000000010',
        '11111111-0001-4000-8000-000000000010',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000011',
        'aaaaaaaa-0001-4000-8000-000000000011',
        'Lucas', 'Schmidt',
        'Blockchain Developer',
        'Berlin, Germany',
        'mid',
        ARRAY['Solidity', 'Rust', 'TypeScript', 'Ethereum', 'Web3.js', 'Hardhat'],
        'https://github.com',
        'https://linkedin.com',
        'https://google.com',
        'Blockchain developer building decentralized applications and smart contracts. 3 years in Web3, previously a traditional backend engineer. Passionate about DeFi and on-chain governance.',
        'Available',
        '33333333-0001-4000-8000-000000000011',
        '11111111-0001-4000-8000-000000000011',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000012',
        'aaaaaaaa-0001-4000-8000-000000000012',
        'Amara', 'Okafor',
        'iOS Developer',
        'London, UK',
        'senior',
        ARRAY['Swift', 'SwiftUI', 'Objective-C', 'Core Data', 'Combine', 'UIKit'],
        'https://github.com',
        'https://linkedin.com',
        NULL,
        'iOS developer with 6 years of experience building native apps. Expert in SwiftUI and modern iOS architecture patterns. Shipped apps for Fortune 500 companies and startups alike.',
        'OpenToOffers',
        '33333333-0001-4000-8000-000000000012',
        '11111111-0001-4000-8000-000000000012',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000013',
        'aaaaaaaa-0001-4000-8000-000000000013',
        'Ryan', 'Murphy',
        'Platform Engineer',
        'Dublin, Ireland',
        'lead',
        ARRAY['Kubernetes', 'Go', 'Python', 'ArgoCD', 'Prometheus', 'Grafana'],
        'https://github.com',
        'https://linkedin.com',
        NULL,
        'Platform engineer leading internal developer platform initiatives. 10 years of experience building tools that make developers more productive. Strong advocate for platform as a product.',
        'NotAvailable',
        '33333333-0001-4000-8000-000000000013',
        '11111111-0001-4000-8000-000000000013',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000014',
        'aaaaaaaa-0001-4000-8000-000000000014',
        'Nina', 'Volkov',
        'Full Stack Developer',
        'Toronto, Canada',
        'mid',
        ARRAY['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'GraphQL'],
        'https://github.com',
        'https://linkedin.com',
        'https://google.com',
        'Full stack TypeScript developer passionate about end-to-end type safety. 4 years of experience building modern web applications. Active open source contributor.',
        'Available',
        '33333333-0001-4000-8000-000000000014',
        '11111111-0001-4000-8000-000000000014',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000015',
        'aaaaaaaa-0001-4000-8000-000000000015',
        'Carlos', 'Mendez',
        'Junior Backend Developer',
        'Miami, FL',
        'junior',
        ARRAY['Java', 'Spring Boot', 'MySQL', 'Docker', 'REST APIs'],
        'https://github.com',
        'https://linkedin.com',
        NULL,
        'Junior backend developer with a computer science degree and 1 year of professional experience. Strong fundamentals in Java and Spring ecosystem. Eager to learn and contribute to meaningful projects.',
        'Available',
        '33333333-0001-4000-8000-000000000015',
        '11111111-0001-4000-8000-000000000015',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000016',
        'aaaaaaaa-0001-4000-8000-000000000016',
        'Hannah', 'Lee',
        'QA Automation Engineer',
        'Singapore',
        'mid',
        ARRAY['Python', 'Selenium', 'Playwright', 'Cypress', 'Jest', 'CI/CD'],
        'https://github.com',
        'https://linkedin.com',
        NULL,
        'QA automation engineer building robust test frameworks. 4 years of experience in ensuring software quality through automation. Expert in both frontend and API testing.',
        'OpenToOffers',
        '33333333-0001-4000-8000-000000000016',
        '11111111-0001-4000-8000-000000000016',
        true, NOW(), NOW()
      ),
      (
        'bbbbbbbb-0001-4000-8000-000000000017',
        'aaaaaaaa-0001-4000-8000-000000000017',
        'David', 'Wright',
        'Engineering Manager',
        'Portland, OR',
        'lead',
        ARRAY['JavaScript', 'Python', 'Team Leadership', 'Agile', 'System Design'],
        'https://github.com',
        'https://linkedin.com',
        NULL,
        'Engineering manager with 11 years of experience, including 4 years leading teams. Previously IC at Google and Microsoft. I help teams ship great products while growing their careers.',
        'OpenToOffers',
        '33333333-0001-4000-8000-000000000017',
        '11111111-0001-4000-8000-000000000017',
        true, NOW(), NOW()
      )
    `);

    // Insert Experience records
    await queryRunner.query(`
      INSERT INTO experience (id, "developerId", position, "companyName", "startYear", "endYear", description, "createdAt", "updatedAt") VALUES
      -- Marcus Chen
      ('cccccccc-0001-4000-8000-000000000001', 'bbbbbbbb-0001-4000-8000-000000000001', 'Senior Full Stack Engineer', 'Stripe', 2021, NULL, 'Building payment infrastructure and developer tools. Led migration of legacy services to microservices architecture.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000002', 'bbbbbbbb-0001-4000-8000-000000000001', 'Full Stack Engineer', 'Airbnb', 2019, 2021, 'Worked on the host experience team, improving listing management tools and booking flows.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000003', 'bbbbbbbb-0001-4000-8000-000000000001', 'Software Engineer', 'Startup (Acquired)', 2018, 2019, 'Early engineer at a Y Combinator startup. Built the MVP and helped scale to 100k users.', NOW(), NOW()),

      -- Sarah Johnson
      ('cccccccc-0001-4000-8000-000000000004', 'bbbbbbbb-0001-4000-8000-000000000002', 'Frontend Architect', 'TechCorp', 2022, NULL, 'Leading frontend architecture and design system development for a team of 15 engineers.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000005', 'bbbbbbbb-0001-4000-8000-000000000002', 'Senior Frontend Engineer', 'Meta', 2018, 2022, 'Built React components used across Facebook and Instagram. Contributed to the React design system.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000006', 'bbbbbbbb-0001-4000-8000-000000000002', 'Frontend Developer', 'Agency', 2015, 2018, 'Developed responsive web applications for various clients in e-commerce and media industries.', NOW(), NOW()),

      -- Alex Rivera
      ('cccccccc-0001-4000-8000-000000000007', 'bbbbbbbb-0001-4000-8000-000000000003', 'Backend Engineer', 'FinTech Startup', 2022, NULL, 'Building payment processing APIs handling millions of transactions. Implemented fraud detection system.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000008', 'bbbbbbbb-0001-4000-8000-000000000003', 'Junior Developer', 'Software Agency', 2021, 2022, 'Developed Django applications for clients. Gained experience in agile development and code reviews.', NOW(), NOW()),

      -- Emma Thompson
      ('cccccccc-0001-4000-8000-000000000009', 'bbbbbbbb-0001-4000-8000-000000000004', 'Senior DevOps Engineer', 'Netflix', 2021, NULL, 'Managing cloud infrastructure serving billions of requests. Implemented chaos engineering practices.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000010', 'bbbbbbbb-0001-4000-8000-000000000004', 'DevOps Engineer', 'Amazon', 2019, 2021, 'Built CI/CD pipelines and managed Kubernetes clusters for internal tools team.', NOW(), NOW()),

      -- James Kim
      ('cccccccc-0001-4000-8000-000000000011', 'bbbbbbbb-0001-4000-8000-000000000005', 'Mobile Developer', 'Health Tech', 2022, NULL, 'Building cross-platform health tracking app with React Native. 2M+ downloads.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000012', 'bbbbbbbb-0001-4000-8000-000000000005', 'iOS Developer', 'Gaming Studio', 2020, 2022, 'Developed casual mobile games with Swift. Optimized performance for older devices.', NOW(), NOW()),

      -- Olivia Martinez
      ('cccccccc-0001-4000-8000-000000000013', 'bbbbbbbb-0001-4000-8000-000000000006', 'Senior Data Engineer', 'Data Analytics Co', 2022, NULL, 'Designing data warehouse architecture and ETL pipelines processing terabytes daily.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000014', 'bbbbbbbb-0001-4000-8000-000000000006', 'Data Engineer', 'Uber', 2019, 2022, 'Built real-time analytics pipelines for surge pricing and driver allocation systems.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000015', 'bbbbbbbb-0001-4000-8000-000000000006', 'Data Analyst', 'Consulting Firm', 2018, 2019, 'Analyzed business data and built dashboards for Fortune 500 clients.', NOW(), NOW()),

      -- Daniel Patel
      ('cccccccc-0001-4000-8000-000000000016', 'bbbbbbbb-0001-4000-8000-000000000007', 'Junior Developer', 'Local Agency', 2024, NULL, 'Building web applications for small businesses using React and Node.js.', NOW(), NOW()),

      -- Sofia Andersson
      ('cccccccc-0001-4000-8000-000000000017', 'bbbbbbbb-0001-4000-8000-000000000008', 'Principal Engineer', 'Cloudflare', 2020, NULL, 'Designing edge computing infrastructure. Leading technical direction for Workers platform.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000018', 'bbbbbbbb-0001-4000-8000-000000000008', 'Staff Engineer', 'Mozilla', 2015, 2020, 'Worked on Firefox performance and Rust compiler improvements.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000019', 'bbbbbbbb-0001-4000-8000-000000000008', 'Senior Engineer', 'Spotify', 2010, 2015, 'Built audio streaming infrastructure serving millions of concurrent users.', NOW(), NOW()),

      -- Michael O''Connor
      ('cccccccc-0001-4000-8000-000000000020', 'bbbbbbbb-0001-4000-8000-000000000009', 'Senior Security Engineer', 'Bank of America', 2021, NULL, 'Leading application security for digital banking platform. Implemented zero-trust architecture.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000021', 'bbbbbbbb-0001-4000-8000-000000000009', 'Security Engineer', 'CrowdStrike', 2018, 2021, 'Developed threat detection algorithms and incident response tooling.', NOW(), NOW()),

      -- Yuki Tanaka
      ('cccccccc-0001-4000-8000-000000000022', 'bbbbbbbb-0001-4000-8000-000000000010', 'ML Engineer', 'E-commerce Giant', 2022, NULL, 'Building recommendation systems serving 50M+ users. Reduced inference latency by 40%.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000023', 'bbbbbbbb-0001-4000-8000-000000000010', 'Data Scientist', 'Research Lab', 2020, 2022, 'Published papers on efficient NLP models. Developed production-ready text classification systems.', NOW(), NOW()),

      -- Lucas Schmidt
      ('cccccccc-0001-4000-8000-000000000024', 'bbbbbbbb-0001-4000-8000-000000000011', 'Blockchain Developer', 'DeFi Protocol', 2022, NULL, 'Building smart contracts for decentralized exchange. TVL reached $50M.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000025', 'bbbbbbbb-0001-4000-8000-000000000011', 'Backend Engineer', 'FinTech', 2020, 2022, 'Built trading APIs and payment integrations before transitioning to Web3.', NOW(), NOW()),

      -- Amara Okafor
      ('cccccccc-0001-4000-8000-000000000026', 'bbbbbbbb-0001-4000-8000-000000000012', 'Senior iOS Developer', 'Media Company', 2021, NULL, 'Leading iOS development for streaming app with 5M+ users. Implemented SwiftUI migration.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000027', 'bbbbbbbb-0001-4000-8000-000000000012', 'iOS Developer', 'Banking App', 2018, 2021, 'Built secure mobile banking features including biometric authentication and payments.', NOW(), NOW()),

      -- Ryan Murphy
      ('cccccccc-0001-4000-8000-000000000028', 'bbbbbbbb-0001-4000-8000-000000000013', 'Platform Engineering Lead', 'SaaS Company', 2021, NULL, 'Building internal developer platform. Reduced deployment time from hours to minutes.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000029', 'bbbbbbbb-0001-4000-8000-000000000013', 'Senior SRE', 'Shopify', 2017, 2021, 'Managed infrastructure for Black Friday scale. Built self-healing systems.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000030', 'bbbbbbbb-0001-4000-8000-000000000013', 'DevOps Engineer', 'Startup', 2014, 2017, 'Set up infrastructure from scratch. Implemented first CI/CD pipelines.', NOW(), NOW()),

      -- Nina Volkov
      ('cccccccc-0001-4000-8000-000000000031', 'bbbbbbbb-0001-4000-8000-000000000014', 'Full Stack Developer', 'Productivity SaaS', 2022, NULL, 'Building collaborative tools with real-time features. Implemented end-to-end type safety with tRPC.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000032', 'bbbbbbbb-0001-4000-8000-000000000014', 'Frontend Developer', 'Agency', 2020, 2022, 'Built e-commerce sites and marketing pages for various clients using Next.js.', NOW(), NOW()),

      -- Carlos Mendez
      ('cccccccc-0001-4000-8000-000000000033', 'bbbbbbbb-0001-4000-8000-000000000015', 'Junior Backend Developer', 'E-commerce', 2024, NULL, 'Building REST APIs and microservices with Spring Boot. Learning Kubernetes.', NOW(), NOW()),

      -- Hannah Lee
      ('cccccccc-0001-4000-8000-000000000034', 'bbbbbbbb-0001-4000-8000-000000000016', 'QA Automation Engineer', 'Gaming Company', 2022, NULL, 'Building test automation framework for multiplayer games. 90% test coverage achieved.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000035', 'bbbbbbbb-0001-4000-8000-000000000016', 'QA Engineer', 'Enterprise Software', 2020, 2022, 'Manual and automated testing for B2B SaaS platform. Introduced Playwright for E2E testing.', NOW(), NOW()),

      -- David Wright
      ('cccccccc-0001-4000-8000-000000000036', 'bbbbbbbb-0001-4000-8000-000000000017', 'Engineering Manager', 'Growth Startup', 2021, NULL, 'Managing team of 8 engineers. Shipped features that doubled user engagement.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000037', 'bbbbbbbb-0001-4000-8000-000000000017', 'Senior Software Engineer', 'Google', 2016, 2021, 'Worked on Google Cloud Platform. Tech lead for internal developer tools.', NOW(), NOW()),
      ('cccccccc-0001-4000-8000-000000000038', 'bbbbbbbb-0001-4000-8000-000000000017', 'Software Engineer', 'Microsoft', 2013, 2016, 'Developed features for Azure DevOps. Grew from junior to senior engineer.', NOW(), NOW())
    `);

    // Insert Project records
    await queryRunner.query(`
      INSERT INTO project (id, "developerId", name, description, "techStack", url, "createdAt", "updatedAt") VALUES
      -- Marcus Chen
      ('dddddddd-0001-4000-8000-000000000001', 'bbbbbbbb-0001-4000-8000-000000000001', 'DevTools CLI', 'Open source CLI tool for streamlining development workflows. 2k+ GitHub stars.', ARRAY['Go', 'Cobra', 'GitHub Actions'], 'https://github.com', NOW(), NOW()),
      ('dddddddd-0001-4000-8000-000000000002', 'bbbbbbbb-0001-4000-8000-000000000001', 'API Gateway', 'High-performance API gateway handling 100k requests/second.', ARRAY['Node.js', 'Redis', 'PostgreSQL'], NULL, NOW(), NOW()),

      -- Sarah Johnson
      ('dddddddd-0001-4000-8000-000000000003', 'bbbbbbbb-0001-4000-8000-000000000002', 'Component Library', 'Accessible React component library with 50+ components. Used by 200+ projects.', ARRAY['React', 'TypeScript', 'Storybook', 'Tailwind'], 'https://github.com', NOW(), NOW()),

      -- Sofia Andersson
      ('dddddddd-0001-4000-8000-000000000004', 'bbbbbbbb-0001-4000-8000-000000000008', 'Rust HTTP Parser', 'Ultra-fast HTTP parser written in Rust. Used in production by several companies.', ARRAY['Rust'], 'https://github.com', NOW(), NOW()),
      ('dddddddd-0001-4000-8000-000000000005', 'bbbbbbbb-0001-4000-8000-000000000008', 'Distributed KV Store', 'Educational distributed key-value store implementation.', ARRAY['Rust', 'gRPC', 'Raft'], 'https://github.com', NOW(), NOW()),

      -- Yuki Tanaka
      ('dddddddd-0001-4000-8000-000000000006', 'bbbbbbbb-0001-4000-8000-000000000010', 'NLP Toolkit', 'Lightweight NLP library for text classification and entity extraction.', ARRAY['Python', 'PyTorch', 'Transformers'], 'https://github.com', NOW(), NOW()),

      -- Lucas Schmidt
      ('dddddddd-0001-4000-8000-000000000007', 'bbbbbbbb-0001-4000-8000-000000000011', 'DeFi Dashboard', 'Portfolio tracker for DeFi positions across multiple chains.', ARRAY['TypeScript', 'Next.js', 'Web3.js', 'The Graph'], 'https://google.com', NOW(), NOW()),

      -- Nina Volkov
      ('dddddddd-0001-4000-8000-000000000008', 'bbbbbbbb-0001-4000-8000-000000000014', 'Type-Safe API', 'Full-stack TypeScript template with tRPC, Prisma, and Next.js.', ARRAY['TypeScript', 'tRPC', 'Prisma', 'Next.js'], 'https://github.com', NOW(), NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete in reverse order of dependencies
    await queryRunner.query(`DELETE FROM project WHERE id LIKE 'dddddddd-0001-4000-8000-%'`);
    await queryRunner.query(`DELETE FROM experience WHERE id LIKE 'cccccccc-0001-4000-8000-%'`);
    await queryRunner.query(`DELETE FROM developer WHERE id LIKE 'bbbbbbbb-0001-4000-8000-%'`);
    await queryRunner.query(`DELETE FROM "user" WHERE id LIKE 'aaaaaaaa-0001-4000-8000-%'`);
    await queryRunner.query(`DELETE FROM media WHERE id LIKE '33333333-0001-4000-8000-%'`);
    await queryRunner.query(`DELETE FROM media WHERE id LIKE '11111111-0001-4000-8000-%'`);
  }
}
