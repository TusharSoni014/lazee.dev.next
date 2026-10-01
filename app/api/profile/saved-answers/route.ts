import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getCorsHeaders } from "@/lib/cors";
import {
  fetchUserSavedAnswers,
  storeUserSavedAnswer,
  removeUserSavedAnswer,
  updateUserSavedAnswer,
} from "@/lib/saved-answers/saved-answer-service";

export const dynamic = "force-dynamic";

export const OPTIONS = async (request: NextRequest) => {
  const origin = request.headers.get("origin");
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
};

export const GET = async (request: NextRequest) => {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: corsHeaders },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const savedAnswers = await fetchUserSavedAnswers(user.id);

    return NextResponse.json(
      { success: true, savedAnswers },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("GET saved answers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved answers" },
      { status: 500, headers: corsHeaders },
    );
  }
};

export const POST = async (request: NextRequest) => {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: corsHeaders },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { question, answer } = body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (!answer || typeof answer !== "string" || !answer.trim()) {
      return NextResponse.json(
        { error: "Answer is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const savedAnswer = await storeUserSavedAnswer(user.id, {
      question: question.trim(),
      answer: answer.trim(),
    });

    return NextResponse.json(
      { success: true, savedAnswer },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    console.error("POST saved answer error:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: corsHeaders },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { error: "Answer ID is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    await removeUserSavedAnswer(user.id, id);

    return NextResponse.json(
      { success: true, message: "Answer removed" },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("DELETE saved answer error:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: corsHeaders },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { id, question, answer } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Answer ID is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (question !== undefined && (!question || typeof question !== "string" || !question.trim())) {
      return NextResponse.json(
        { error: "Question cannot be empty" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (answer !== undefined && (!answer || typeof answer !== "string" || !answer.trim())) {
      return NextResponse.json(
        { error: "Answer cannot be empty" },
        { status: 400, headers: corsHeaders },
      );
    }

    const savedAnswer = await updateUserSavedAnswer(user.id, id, {
      question: question?.trim(),
      answer: answer?.trim(),
    });

    return NextResponse.json(
      { success: true, savedAnswer },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("PATCH saved answer error:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
};

