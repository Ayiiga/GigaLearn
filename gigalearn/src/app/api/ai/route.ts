import { NextRequest, NextResponse } from "next/server";
import { runAIFeature } from "@/lib/ai/openai";
import type { AIFeatureRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AIFeatureRequest;

    if (!body.feature || !body.input) {
      return NextResponse.json({ error: "Missing feature or input" }, { status: 400 });
    }

    const response = await runAIFeature(body);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
