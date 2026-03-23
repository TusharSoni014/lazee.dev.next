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
