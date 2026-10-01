"use client";

import { useState } from "react";
import { Bookmark, Plus, Trash2, Copy, Check, Search, MessageSquareQuote, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface SavedAnswerItem {
  id: string;
  question: string;
  answer: string;
  createdAt: string | Date;
}

interface Props {
  initialSavedAnswers?: SavedAnswerItem[];
}

export const SavedAnswersManager = ({ initialSavedAnswers = [] }: Props) => {
  const [answers, setAnswers] = useState<SavedAnswerItem[]>(initialSavedAnswers);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [questionInput, setQuestionInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<SavedAnswerItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = answers.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Answer copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAdd = async () => {
    if (!questionInput.trim() || !answerInput.trim()) {
      toast.error("Please fill in both the question and answer.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile/saved-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionInput.trim(),
          answer: answerInput.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save answer");
      }

      const data = await res.json();
      setAnswers((prev) => [data.savedAnswer, ...prev]);
      setQuestionInput("");
      setAnswerInput("");
      setIsAddOpen(false);
      toast.success("Question and answer saved to your profile!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/profile/saved-answers?id=${itemToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete saved answer");

      setAnswers((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      toast.success("Saved answer removed");
      setItemToDelete(null);
    } catch {
      toast.error("Could not remove saved answer");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <Bookmark className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Saved Questions &amp; Answers
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Reuse your preferred answers across job forms and applications.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs rounded-xl shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="size-3.5 mr-1" />
          Add Q&amp;A
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
        <Input
          placeholder="Search saved questions or answers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs h-9 rounded-xl border-zinc-200 dark:border-zinc-800"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
          <MessageSquareQuote className="size-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {search.trim() ? "No matching saved answers" : "No saved questions yet"}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            {search.trim()
              ? "Try adjusting your search keyword."
              : "When you answer job questions with the extension, click 'Save Answer' to store them here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 max-h-[480px] overflow-y-auto pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/30 hover:border-orange-500/30 transition-all flex flex-col gap-2 group"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex-1 leading-snug">
                  {item.question}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleCopy(item.id, item.answer)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Copy Answer"
                  >
                    {copiedId === item.id ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setItemToDelete(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="Delete Answer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed bg-white dark:bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/60">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Save New Question &amp; Answer</DialogTitle>
            <DialogDescription className="text-xs">
              Save custom question responses for quick 1-click insertion during applications.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1 block">
                Question
              </label>
              <Input
                placeholder="e.g., Why do you want to work here?"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1 block">
                Answer
              </label>
              <Textarea
                placeholder="Your preferred response..."
                rows={4}
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                className="text-xs rounded-xl resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-500 text-white text-xs rounded-xl"
            >
              {isSubmitting ? "Saving..." : "Save Answer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && !isDeleting && setItemToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="size-4" />
              Delete Saved Question?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {itemToDelete && (
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800/80 text-xs">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{itemToDelete.question}</p>
              {itemToDelete.answer && (
                <p className="mt-1 text-zinc-500 dark:text-zinc-400 line-clamp-2 italic">
                  &ldquo;{itemToDelete.answer}&rdquo;
                </p>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setItemToDelete(null)}
              disabled={isDeleting}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-500 text-white text-xs rounded-xl"
            >
              {isDeleting ? "Deleting..." : "Delete Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
