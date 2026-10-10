import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:password@localhost:5432/lazee?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Seed or update Dev Contributor User
  const devUser = await prisma.user.upsert({
    where: { email: "dev@lazee.dev" },
    update: {
      isAdmin: true,
      membership: "PRO",
      credits: 500,
    },
    create: {
      email: "dev@lazee.dev",
      name: "Alex Rivera",
      username: "alexrivera",
      firstName: "Alex",
      lastName: "Rivera",
      credits: 500,
      membership: "PRO",
      isAdmin: true,
      emailVerified: new Date(),
      city: "San Francisco",
      country: "United States",
      phoneNumber: "+1 555-0199",
      contactEmail: "dev@lazee.dev",
      jobType: "Full-time",
      noticePeriod: 0,
      skills: [
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "Tailwind CSS",
        "PostgreSQL",
        "Prisma",
        "Docker",
      ],
      github: "https://github.com/Sahill357/lazee.dev.next",
      portfolio: "https://lazee.dev",
      specificQuestionGuidance:
        "Focus on 5+ years of full-stack engineering experience with React, Next.js, and browser extension automation.",
      coverLetter:
        "I am a passionate software engineer excited about building developer tools and automating repetitive workflows.",
    },
  });

  console.log(`✅ Seeded user: ${devUser.name} (${devUser.email})`);

  // 2. Seed Experience for dev user
  const existingExp = await prisma.experience.findFirst({
    where: { userId: devUser.id },
  });

  if (!existingExp) {
    await prisma.experience.createMany({
      data: [
        {
          userId: devUser.id,
          companyName: "Acme Cloud Technologies",
          role: "Senior Full Stack Engineer",
          location: "San Francisco, CA (Remote)",
          startDate: new Date("2022-01-15"),
          isCurrent: true,
          description:
            "Architected web applications and browser automation tools. Improved end-to-end performance by 40%.",
        },
        {
          userId: devUser.id,
          companyName: "HyperScale Software",
          role: "Software Engineer",
          location: "New York, NY",
          startDate: new Date("2020-03-01"),
          endDate: new Date("2021-12-31"),
          isCurrent: false,
          description:
            "Built distributed microservices, REST APIs, and responsive React frontend dashboards.",
        },
      ],
    });
    console.log("✅ Seeded experiences");
  }

  // 3. Seed Education for dev user
  const existingEdu = await prisma.education.findFirst({
    where: { userId: devUser.id },
  });

  if (!existingEdu) {
    await prisma.education.create({
      data: {
        userId: devUser.id,
        schoolName: "University of California, Berkeley",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        startDate: new Date("2016-08-20"),
        endDate: new Date("2020-05-15"),
        isCurrent: false,
        isPublic: true,
        description:
          "Focus on Distributed Systems, Algorithms, and Software Engineering.",
      },
    });
    console.log("✅ Seeded education");
  }

  // 4. Seed Project for dev user
  const existingProject = await prisma.project.findFirst({
    where: { userId: devUser.id },
  });

  if (!existingProject) {
    await prisma.project.create({
      data: {
        userId: devUser.id,
        name: "Lazee Form Automator",
        role: "Lead Creator",
        contribution:
          "Built browser automation extension to streamline application forms with zero friction.",
        duration: "6 months",
        activeLink: "https://lazee.dev",
        githubLink: "https://github.com/Sahill357/lazee.dev.next",
        stacks: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        description:
          "Open-source AI-assisted browser companion that speeds up job applications by 10x.",
        isTopProject: true,
      },
    });
    console.log("✅ Seeded projects");
  }

  // 5. Seed Saved Answers
  const existingAnswer = await prisma.savedAnswer.findFirst({
    where: { userId: devUser.id },
  });

  if (!existingAnswer) {
    await prisma.savedAnswer.createMany({
      data: [
        {
          userId: devUser.id,
          question: "Why do you want to join our team?",
          answer:
            "I love building high-impact developer tooling and open source software that saves engineers hundreds of hours.",
        },
        {
          userId: devUser.id,
          question: "Describe your experience with TypeScript and Next.js.",
          answer:
            "I have over 4 years of experience working with Next.js App Router, React 19, TypeScript strict mode, and full-stack API routes.",
        },
      ],
    });
    console.log("✅ Seeded saved answers");
  }

  // 6. Seed Career Job Listings for /careers
  const jobsCount = await prisma.job.count();
  if (jobsCount === 0) {
    await prisma.job.createMany({
      data: [
        {
          title: "Senior Full-Stack Engineer",
          department: "Core Engineering",
          location: "Worldwide",
          type: "Full-time",
          workplaceType: "Remote",
          compensation: "$120k - $160k · Equity",
          experience: "4+ years",
          description:
            "Join us to build high-performance web tooling, deterministic form autofill engines, and Next.js full-stack features.",
          requirements:
            "- Deep proficiency with React, Next.js (App Router), TypeScript, and Tailwind CSS.\n- Experience with PostgreSQL, Prisma ORM, and database optimization.\n- Passion for open-source and developer experience.",
          isOpen: true,
          applyEmail: "career@lazee.dev",
        },
        {
          title: "AI & Automation Engineer",
          department: "AI & Extension",
          location: "Worldwide",
          type: "Full-time",
          workplaceType: "Remote",
          compensation: "$130k - $170k · Equity",
          experience: "3+ years",
          description:
            "Develop AI workflows, prompt pipelines, and intelligent form parsing models to automate complex job applications seamlessly.",
          requirements:
            "- Hands-on experience with LLMs, prompt engineering, and embeddings.\n- Experience writing Chrome Extensions (Manifest V3) and DOM manipulation scripts.\n- Strong TypeScript and backend API fundamentals.",
          isOpen: true,
          applyEmail: "career@lazee.dev",
        },
        {
          title: "Developer Relations & Community Lead",
          department: "Growth & Community",
          location: "Worldwide",
          type: "Full-time",
          workplaceType: "Remote",
          compensation: "$90k - $130k · Equity",
          experience: "2+ years",
          description:
            "Engage with our open source contributors, create technical demos, write documentation, and grow the Lazee.dev community.",
          requirements:
            "- Excellent technical writing and video demonstration skills.\n- Active presence in open-source developer communities.\n- Ability to build sample projects and guide external contributors.",
          isOpen: true,
          applyEmail: "career@lazee.dev",
        },
      ],
    });
    console.log("✅ Seeded career job listings");
  }

  // 7. Seed AppSettings
  await prisma.appSetting.upsert({
    where: { key: "openrouter_model" },
    update: {},
    create: {
      key: "openrouter_model",
      value: "meta-llama/llama-3-8b-instruct",
    },
  });
  console.log("✅ Seeded app settings");

  console.log("\n✨ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
