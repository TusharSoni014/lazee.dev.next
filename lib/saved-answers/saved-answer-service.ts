import prisma from "@/lib/prisma";

export interface CreateSavedAnswerInput {
  question: string;
  answer: string;
}

export interface UpdateSavedAnswerInput {
  question?: string;
  answer?: string;
}

export const fetchUserSavedAnswers = async (userId: string) => {
  if (!userId) return [];

  return prisma.savedAnswer.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const storeUserSavedAnswer = async (
  userId: string,
  input: CreateSavedAnswerInput,
) => {
  const trimmedQuestion = input.question?.trim();
  const trimmedAnswer = input.answer?.trim();

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!trimmedQuestion) {
    throw new Error("Question cannot be empty");
  }

  if (!trimmedAnswer) {
    throw new Error("Answer cannot be empty");
  }

  return prisma.savedAnswer.create({
    data: {
      userId,
      question: trimmedQuestion,
      answer: trimmedAnswer,
    },
  });
};

export const removeUserSavedAnswer = async (userId: string, id: string) => {
  if (!userId || !id) {
    throw new Error("User ID and Answer ID are required");
  }

  const existing = await prisma.savedAnswer.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Saved answer not found or unauthorized");
  }

  return prisma.savedAnswer.delete({
    where: { id },
  });
};

export const updateUserSavedAnswer = async (
  userId: string,
  id: string,
  input: UpdateSavedAnswerInput,
) => {
  if (!userId || !id) {
    throw new Error("User ID and Answer ID are required");
  }

  const existing = await prisma.savedAnswer.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Saved answer not found or unauthorized");
  }

  return prisma.savedAnswer.update({
    where: { id },
    data: {
      ...(input.question?.trim() ? { question: input.question.trim() } : {}),
      ...(input.answer?.trim() ? { answer: input.answer.trim() } : {}),
    },
  });
};
