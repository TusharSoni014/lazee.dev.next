import { redirect } from "next/navigation";

export default function SavedQuestionsRedirect() {
  redirect("/profile/saved-questions");
}
