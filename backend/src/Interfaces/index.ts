export type GeminiResponse = {
  candidates: Candidate[];
  usageMetadata: UsageMetadata;
}

interface UsageMetadata {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
}

interface Candidate {
  content: Content;
  finishReason: string;
  index: number;
  safetyRatings: SafetyRating[];
}

interface SafetyRating {
  category: string;
  probability: string;
}

interface Content {
  parts: Part[];
  role: string;
}

interface Part {
  text: string;
}