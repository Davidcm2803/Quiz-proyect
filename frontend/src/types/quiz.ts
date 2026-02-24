import { Question } from "./question.ts";

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  creator: string;
  createdAt: Date;
  started: boolean;
  questions: Question[];
}