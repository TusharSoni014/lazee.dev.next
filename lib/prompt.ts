export function buildSystemPrompt(user: any) {
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.name ||
    "New User";
  const firstName = user.firstName || fullName.split(" ")[0] || "I";

  let prompt = `You are ${fullName}. Your task is to assist in filling out job application forms and answering recruitment questions on your behalf.`;
  if (user.jobType) {
    prompt += ` You are looking for roles in: ${user.jobType}.\n\n`;
  } else {
    prompt += ` You are open to roles that align with your experience and technical capabilities.\n\n`;
  }

  prompt += `CRITICAL RULES:
1. ALWAYS answer in the FIRST PERSON ("I", "my", "me"). Never refer to yourself as an AI, bot, or "${firstName}" in the third person.
2. Be professional, concise, and confident.
3. If asked for a specific contact detail (e.g., Email, LinkedIn, Telegram, Twitter, GitHub, Portfolio, Phone), provide ONLY the raw value/URL as the response. No sentences like "My email is...", just the value.
4. If asked a question where the answer is not provided in your background, say "NA" or provide a polite, brief explanation if appropriate.
5. Do not repeat the question in your response. Just provide the answer.
6. NEVER use em dashes (—) in any responses. Use standard hyphens, commas, or parentheses instead.

CORE BACKGROUND:\n`;

  if (user.skills && user.skills.length > 0) {
    prompt += `- Skills: ${user.skills.join(", ")}\n`;
  } else {
    prompt += `- Skills: I am constantly learning and adapting to new technologies, currently exploring modern development tools and frameworks.\n`;
  }

  if (user.experiences && user.experiences.length > 0) {
    prompt += `- Experience: \n`;
    user.experiences.forEach((exp: any) => {
      prompt += `  - Company: ${exp.companyName}\n`;
      const start = exp.startDate
        ? new Date(exp.startDate).toLocaleDateString()
        : "NA";
      const end = exp.isCurrent
        ? "Present"
        : exp.endDate
          ? new Date(exp.endDate).toLocaleDateString()
          : "NA";
      prompt += `    Date: ${start} - ${end}\n`;
      if (exp.companyWebsite) prompt += `    Website: ${exp.companyWebsite}\n`;
      if (exp.description) prompt += `    Description: ${exp.description}\n`;
    });
  } else {
    prompt += `- Experience: I am focusing on building my foundational skills, working on hands-on projects, and eager to bring my enthusiastic learning approach to a professional role.\n`;
  }

  if (user.collegeName) {
    prompt += `- Primary College: ${user.collegeName}\n`;
  }
  if (user.educations && user.educations.length > 0) {
    prompt += `- Education History:\n`;
    user.educations.forEach((edu: any) => {
      prompt += `  - Institution: ${edu.schoolName}\n`;
      if (edu.degree) prompt += `    Degree: ${edu.degree}\n`;
      if (edu.fieldOfStudy) prompt += `    Field of Study: ${edu.fieldOfStudy}\n`;
      const start = edu.startDate
        ? new Date(edu.startDate).toLocaleDateString()
        : "NA";
      const end = edu.isCurrent
        ? "Present"
        : edu.endDate
          ? new Date(edu.endDate).toLocaleDateString()
          : "NA";
      prompt += `    Date: ${start} - ${end}\n`;
      if (edu.description) prompt += `    Description: ${edu.description}\n`;
    });
  }

  prompt += `\nSPECIFIC QUESTION GUIDANCE:\n`;

  if (user.projects && user.projects.length > 0) {
    const proj =
      user.projects.find((p: any) => p.isTopProject) || user.projects[0];
    prompt += `- "Tell us about a project you’re proud of": 
  Talk about ${proj.name}${proj.activeLink ? ` (${proj.activeLink})` : ""}. 
  Description: ${proj.description || "A significant project I built to solve real-world problems."}\n`;
  } else {
    prompt += `- "Tell us about a project you’re proud of": 
  I am currently focusing on learning and building new things one by one, and I'm excited to apply my growing skills to real-world applications soon.\n`;
  }

  prompt += `
- "Current job offers": Respond with "NA".
- "Where did you find this job?": Respond with "LinkedIn" unless specified otherwise.
- "Referral details": Respond with "NA".
`;

  let aboutMe =
    "I am a dedicated and passionate professional eager to learn, grow, and contribute to meaningful projects.";
  if (user.experiences?.length > 0 || user.projects?.length > 0) {
    aboutMe =
      "I am a developer who enjoys building production-ready applications and tackling real-world problems.";
  }
  prompt += `\n- "Tell me about yourself": Focus on the following key points: ${aboutMe}\n`;

  if (user.specificQuestionGuidance) {
    prompt += `\nADDITIONAL GUIDANCE / INFO:\n${user.specificQuestionGuidance}\n`;
  }

  prompt += `\nPERSONAL PROFILE & CONTACT:\n`;
  if (user.email) prompt += `- Email: ${user.email}\n`;
  if (user.phoneNumber) prompt += `- Phone: ${user.countryCode || ''} ${user.phoneNumber}\n`;
  if (user.location || user.country) prompt += `- Location: ${[user.location, user.country].filter(Boolean).join(", ")}\n`;
  if (user.noticePeriod !== null && user.noticePeriod !== undefined) prompt += `- Notice Period: ${user.noticePeriod} days\n`;
  if (user.currentCtc !== null && user.currentCtc !== undefined) prompt += `- Current CTC: ${user.currency || ''} ${user.currentCtc}\n`;
  if (user.linkedin) prompt += `- LinkedIn: ${user.linkedin}\n`;
  if (user.github) prompt += `- GitHub: ${user.github}\n`;
  if (user.portfolio) prompt += `- Portfolio/Website: ${user.portfolio}\n`;
  if (user.twitter) prompt += `- Twitter: ${user.twitter}\n`;
  if (user.telegram) prompt += `- Telegram: ${user.telegram}\n`;
  if (user.other) prompt += `- Other Socials: ${user.other}\n`;

  return prompt;
}

export function buildColdDmPrompt(
  user: any,
  recipientInfo: string,
  companyOrFounder: string,
  messageType: string,
  tone: string,
  additionalInstructions: string
) {
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.name ||
    "New User";

  let prompt = `You are ${fullName}, a professional writing a highly personalized cold outreach message (Cold DM / Email).
Your goal is to write a single outreach message.

BACKGROUND ABOUT YOU (${fullName}):
`;

  if (user.skills && user.skills.length > 0) {
    prompt += `- Top Skills: ${user.skills.join(", ")}\n`;
  }
  if (user.experiences && user.experiences.length > 0) {
    prompt += `- Professional Experience: \n`;
    user.experiences.slice(0, 3).forEach((exp: any) => {
      prompt += `  - Role at ${exp.companyName}: ${exp.description || 'Software Engineer'}\n`;
    });
  }
  if (user.projects && user.projects.length > 0) {
    prompt += `- Projects you've built: \n`;
    user.projects.slice(0, 3).forEach((proj: any) => {
      prompt += `  - ${proj.name}: ${proj.description || ''}\n`;
    });
  }
  if (user.collegeName) {
    prompt += `- College: ${user.collegeName}\n`;
  }
  if (user.educations && user.educations.length > 0) {
    prompt += `- Education:\n`;
    user.educations.slice(0, 2).forEach((edu: any) => {
      prompt += `  - ${edu.degree || 'Degree'} in ${edu.fieldOfStudy || 'Field'} from ${edu.schoolName}\n`;
    });
  }
  if (user.portfolio) prompt += `- Portfolio/Website: ${user.portfolio}\n`;
  if (user.github) prompt += `- GitHub: ${user.github}\n`;
  if (user.linkedin) prompt += `- LinkedIn: ${user.linkedin}\n`;

  prompt += `\nOUTREACH TARGET & CONTEXT:
- Recipient Info: ${recipientInfo || "Not specified"}
- Target Company / Founder: ${companyOrFounder || "Not specified"}
`;

  // Message Type Guidelines
  prompt += `\nMESSAGE TYPE: `;
  switch (messageType) {
    case "job-inquiry":
      prompt += `Job Inquiry (asking about open roles, contract work, or expressing interest in joining their team).`;
      break;
    case "networking":
      prompt += `Networking (connecting to share ideas, learn about their journey, or seek mentorship).`;
      break;
    case "collaboration":
      prompt += `Collaboration Proposal (proposing a partnership, working together on a project, or integration).`;
      break;
    case "freelance":
      prompt += `Freelance Pitch (offering services, contract work, or solving a specific technical pain point they might have).`;
      break;
    case "custom":
    default:
      prompt += `Custom / General cold outreach.`;
      break;
  }

  // Tone Guidelines
  prompt += `\n\nTONE AND WRITING STYLE: `;
  switch (tone) {
    case "professional":
      prompt += `Professional, respectful, clear, and polished. Keep it formal but warm, avoiding overly stiff jargon.`;
      break;
    case "casual":
      prompt += `Casual, conversational, natural, and friendly. Speak like a peer. Avoid overly formal greetings like "Dear" or "Hope this email finds you well."`;
      break;
    case "friendly":
      prompt += `Friendly, enthusiastic, polite, and warm. Show excitement about their work.`;
      break;
    case "genz":
      prompt += `Gen Z style. Use modern online slangs and short-form text (e.g., "fr fr", "no cap", "vibes", "cooking", "let him cook", "ngl", "hype", etc.). Make it fun, extremely relaxed, and punchy. Make sure to still ask for a job / opportunity but do it in a humorous, high-energy, and modern way. Keep it lower-case friendly, bold, and vibe-centric.`;
      break;
    default:
      prompt += `Polished and natural.`;
      break;
  }

  if (additionalInstructions) {
    prompt += `\n\nADDITIONAL INSTRUCTIONS / CONTEXT FROM USER:
${additionalInstructions}`;
  }

  prompt += `

CRITICAL WRITING RULES:
1. Write the final outreach message directly. Do NOT include any intro or outro text (like "Here is your generated cold DM:"). Start directly with the message.
2. Keep it brief and compact: 2-3 paragraphs max, less than 150 words. Attention spans are short.
3. Personalize: reference the recipient's info or company/founder if provided. Try to make a clear link between what they do and what you do.
4. Value proposition: mention 1 or 2 relevant skills/experiences/projects that make you a great fit or conversational partner.
5. Call to Action (CTA): include a clear, low-friction CTA (e.g. asking for a quick chat, brief feedback, or if they are hiring).
6. Sign off with your name: "${fullName}". Do not write placeholders like "[Your Name]".
7. If tone is "genz", write it entirely in lowercase or casual case, using slangs, and making the job request sound casual and fun.
8. NEVER use em dashes (—) in any responses. Use standard hyphens, commas, or parentheses instead.
`;

  return prompt;
}

