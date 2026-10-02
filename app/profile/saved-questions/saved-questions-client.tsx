"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Bookmark,
  MessageSquareQuote,
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  X,
  Pencil,
  Info,
  Calendar,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface SavedAnswerItem {
  id: string;
  question: string;
  answer: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

interface Props {
  initialSavedAnswers?: SavedAnswerItem[];
}

export function SavedQuestionsClient({ initialSavedAnswers = [] }: Props) {
  const [answers, setAnswers] =
    useState<SavedAnswerItem[]>(initialSavedAnswers);
  const [search, setSearch] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  // Quick Composer State
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [isAddingSubmitting, setIsAddingSubmitting] = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Google Keep Card Modal State
  const [activeModalItem, setActiveModalItem] =
    useState<SavedAnswerItem | null>(null);
  const [modalQuestion, setModalQuestion] = useState("");
  const [modalAnswer, setModalAnswer] = useState("");
  const [isSavingModal, setIsSavingModal] = useState(false);

  // Delete Confirmation Modal State
  const [itemToDelete, setItemToDelete] = useState<SavedAnswerItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Copy Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsAddingOpen(false);
    setNewQuestion("");
    setNewAnswer("");
  }, []);

  // Filtered answers based on search
  const filteredAnswers = useMemo(() => {
    if (!search.trim()) return answers;
    const q = search.toLowerCase();
    return answers.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q),
    );
  }, [answers, search]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Answer copied to clipboard");
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2000);
  };

  const handleOpenModal = (item: SavedAnswerItem) => {
    setActiveModalItem(item);
    setModalQuestion(item.question);
    setModalAnswer(item.answer);
  };

  const handleCloseModal = useCallback(() => {
    setActiveModalItem(null);
    setModalQuestion("");
    setModalAnswer("");
  }, []);

  const isModalDirty = Boolean(
    activeModalItem &&
    (modalQuestion.trim() !== activeModalItem.question ||
      modalAnswer.trim() !== activeModalItem.answer),
  );

  const handleSaveModal = useCallback(async () => {
    if (!activeModalItem) return;
    if (!modalQuestion.trim() || !modalAnswer.trim()) {
      toast.error("Both question and answer are required.");
      return;
    }

    setIsSavingModal(true);
    try {
      const res = await fetch("/api/profile/saved-answers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeModalItem.id,
          question: modalQuestion.trim(),
          answer: modalAnswer.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update saved question");
      }

      const data = await res.json();
      const updatedItem: SavedAnswerItem = data.savedAnswer || {
        ...activeModalItem,
        question: modalQuestion.trim(),
        answer: modalAnswer.trim(),
        updatedAt: new Date(),
      };

      setAnswers((prev) =>
        prev.map((item) =>
          item.id === activeModalItem.id ? updatedItem : item,
        ),
      );
      setActiveModalItem(updatedItem);
      toast.success("Question & answer updated!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error saving changes";
      toast.error(message);
    } finally {
      setIsSavingModal(false);
    }
  }, [activeModalItem, modalQuestion, modalAnswer]);

  const handleCancelDelete = useCallback(() => {
    if (!isDeleting) {
      setItemToDelete(null);
    }
  }, [isDeleting]);

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/profile/saved-answers?id=${itemToDelete.id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete saved question");
      }

      setAnswers((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      toast.success("Saved question removed");

      if (activeModalItem?.id === itemToDelete.id) {
        handleCloseModal();
      }
      setItemToDelete(null);
    } catch {
      toast.error("Could not remove saved question");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreate = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error("Please fill in both the question and answer.");
      return;
    }

    setIsAddingSubmitting(true);
    try {
      const res = await fetch("/api/profile/saved-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newQuestion.trim(),
          answer: newAnswer.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save answer");
      }

      const data = await res.json();
      setAnswers((prev) => [data.savedAnswer, ...prev]);
      handleCancel();
      toast.success("Saved question added to your vault!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving";
      toast.error(message);
    } finally {
      setIsAddingSubmitting(false);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");

      // Press "/" to focus search when not typing
      if (e.key === "/" && !isInputFocused) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (e.key === "Escape") {
        if (itemToDelete) {
          handleCancelDelete();
        } else if (activeModalItem) {
          handleCloseModal();
        } else if (isAddingOpen) {
          handleCancel();
        } else if (search) {
          setSearch("");
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (itemToDelete) {
          e.preventDefault();
          confirmDelete();
        } else if (activeModalItem) {
          if (isModalDirty) {
            e.preventDefault();
            handleSaveModal();
          }
        } else if (isAddingOpen) {
          if (newQuestion.trim() && newAnswer.trim() && !isAddingSubmitting) {
            e.preventDefault();
            handleCreate();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    itemToDelete,
    handleCancelDelete,
    confirmDelete,
    activeModalItem,
    isModalDirty,
    handleCloseModal,
    handleSaveModal,
    isAddingOpen,
    newQuestion,
    newAnswer,
    isAddingSubmitting,
    handleCancel,
    search,
  ]);

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-28 transition-colors relative overflow-hidden">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.04),transparent_50%)] pointer-events-none" />

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-8 md:py-12">
        {/* Navigation Breadcrumb */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to profile
        </Link>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex justify-start items-center mb-3 gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-medium ">
                <span>Candidate Workspace</span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span>Saved Questions</span>
              </div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-3 py-1 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60 font-mono">
                {answers.length}{" "}
                {answers.length === 1 ? "Question" : "Questions"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">
              Saved Questions Vault
            </h1>
            <p className="mt-2 max-w-xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Organize and store your best responses for recurring job
              application prompts and screening questions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto"></div>
        </div>

        {/* Action & Search Toolbar (Placed above cards and composer) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          {/* Search Input */}
          <div className="w-full flex justify-center items-center gap-3">
            <div className="relative flex-1 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions or answers..."
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 shadow-xs transition-colors min-h-9"
              />
              {search ? (
                <button
                  onClick={() => {
                    setSearch("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Clear search (Esc)"
                >
                  <X className="size-3.5" />
                </button>
              ) : (
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-200/80 dark:border-zinc-700/60 pointer-events-none hidden sm:inline-block">
                  /
                </kbd>
              )}
            </div>
            <Button
              type="button"
              size="sm"
              variant={isAddingOpen ? "secondary" : "default"}
              onClick={() => {
                if (isAddingOpen) {
                  handleCancel();
                } else {
                  setIsAddingOpen(true);
                  setTimeout(() => questionInputRef.current?.focus(), 60);
                }
              }}
              className="h-9 text-xs sm:text-sm px-3.5 gap-1.5"
            >
              <Plus
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  isAddingOpen && "rotate-45",
                )}
              />
              <span>{isAddingOpen ? "Close Form" : "New Question"}</span>
            </Button>
          </div>

          {/* Results Summary */}
        </div>
        <div className=" mb-6">
          {search.trim() && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 shrink-0 font-mono">
              <span>
                Showing{" "}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {filteredAnswers.length}
                </span>{" "}
                of {answers.length}
              </span>
              <button
                onClick={() => setSearch("")}
                className="text-orange-600 dark:text-orange-400 hover:underline font-medium cursor-pointer ml-1"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Expandable Composer Section */}
        <AnimatePresence>
          {isAddingOpen && (
            <motion.div
              ref={composerRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.16 },
              }}
              className="overflow-hidden mb-6"
            >
              <div className="rounded-2xl border border-orange-500/40 ring-2 ring-orange-500/10 bg-white dark:bg-zinc-900 shadow-md p-4 sm:p-5 space-y-3">
                {/* Question Input */}
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                    <Bookmark className="size-4" />
                  </div>
                  <input
                    ref={questionInputRef}
                    type="text"
                    placeholder="Question context: e.g., Tell me about a time you led a challenging project"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-transparent focus:outline-none"
                  />
                </div>

                {/* Answer Textarea */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <textarea
                    placeholder="Answer: Write your detailed answer to reuse across job applications..."
                    rows={4}
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="w-full text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-transparent focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Composer Footer Actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {newAnswer.length} chars •{" "}
                    {newAnswer.trim()
                      ? newAnswer.trim().split(/\s+/).length
                      : 0}{" "}
                    words
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="text-xs rounded-xl cursor-pointer text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 hover:bg-orange-500/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreate}
                      disabled={
                        isAddingSubmitting ||
                        !newQuestion.trim() ||
                        !newAnswer.trim()
                      }
                      className="text-xs"
                    >
                      {isAddingSubmitting ? "Saving..." : "Save Answer"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards Grid */}
        {filteredAnswers.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 mx-auto">
            <div className="size-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-3">
              <MessageSquareQuote className="size-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {search.trim()
                ? "No matching saved questions"
                : "Your vault is empty"}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg mx-auto leading-relaxed">
              {search.trim()
                ? "Try searching for a different keyword or question context."
                : "Add frequently asked screening and interview questions here for 1-click autofill."}
            </p>
            {search.trim() && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearch("")}
                className="mt-4 text-xs rounded-xl cursor-pointer"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            <AnimatePresence initial={false}>
              {filteredAnswers.map((item) => {
                const formattedDate = item.createdAt
                  ? (() => {
                      try {
                        return format(new Date(item.createdAt), "MMM d, yyyy");
                      } catch {
                        return "";
                      }
                    })()
                  : "";

                return (
                  <motion.div
                    key={item.id}
                    initial={hasMounted ? { opacity: 0, y: 8 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.96,
                      transition: { duration: 0.15 },
                    }}
                    transition={{ duration: 0.18 }}
                    onClick={() => handleOpenModal(item)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 p-5 shadow-xs hover:border-orange-500/40 dark:hover:border-orange-500/30 transition-colors duration-150 cursor-pointer select-none"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start gap-2.5 mb-2.5">
                        <span className="inline-flex items-center justify-center size-5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-[10px] shrink-0 mt-0.5">
                          Q
                        </span>
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
                          {item.question}
                        </h2>
                      </div>

                      {/* Card Answer Body */}
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-5 whitespace-pre-wrap leading-relaxed font-sans pl-0.5">
                        {item.answer}
                      </p>
                    </div>

                    {/* Card Footer Bar */}
                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                        {formattedDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formattedDate}
                          </span>
                        )}
                      </div>

                      {/* Quick Action Icons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(item.id, item.answer);
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Copy Answer"
                        >
                          {copiedId === item.id ? (
                            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(item);
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors cursor-pointer"
                          title="Edit Question"
                        >
                          <Pencil className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete(item);
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Google Keep Popout Modal */}
        <AnimatePresence>
          {activeModalItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                onClick={handleCloseModal}
              />

              {/* Modal Dialog Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800/80 flex items-start justify-between gap-3 bg-zinc-50/40 dark:bg-zinc-950/20">
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-semibold mb-2">
                      <Bookmark className="size-3" />
                      <span>Question</span>
                    </div>
                    <textarea
                      value={modalQuestion}
                      onChange={(e) => setModalQuestion(e.target.value)}
                      placeholder="Question title..."
                      rows={2}
                      className="w-full text-base sm:text-lg font-heading font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 bg-transparent focus:outline-none resize-none leading-snug"
                    />
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
                    title="Close (Esc)"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Modal Body / Answer Textarea */}
                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                    <MessageSquareQuote className="size-3.5" />
                    <span>Answer</span>
                  </div>
                  <textarea
                    value={modalAnswer}
                    onChange={(e) => setModalAnswer(e.target.value)}
                    placeholder="Write your detailed answer..."
                    rows={8}
                    className="w-full text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 bg-transparent focus:outline-none resize-none leading-relaxed font-sans"
                  />
                </div>

                {/* Modal Footer Action Bar */}
                <div className="p-4 px-5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/50 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                    <span>{modalAnswer.length} chars</span>
                    <span>•</span>
                    <span>
                      {modalAnswer.trim()
                        ? modalAnswer.trim().split(/\s+/).length
                        : 0}{" "}
                      words
                    </span>
                    {isModalDirty && (
                      <span className="text-orange-600 dark:text-orange-400 font-sans font-medium text-[11px] ml-1">
                        • Unsaved edits
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleCopy(activeModalItem.id, modalAnswer)
                      }
                      className="text-xs rounded-xl cursor-pointer"
                    >
                      {copiedId === activeModalItem.id ? (
                        <>
                          <Check className="size-3.5 mr-1 text-emerald-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>

                    {/* Delete Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setItemToDelete(activeModalItem)}
                      className="text-xs rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 cursor-pointer"
                    >
                      <Trash2 className="size-3.5 mr-1" />
                      Delete
                    </Button>

                    {/* Save or Done Button */}
                    {isModalDirty ? (
                      <Button
                        size="sm"
                        onClick={handleSaveModal}
                        disabled={
                          isSavingModal ||
                          !modalQuestion.trim() ||
                          !modalAnswer.trim()
                        }
                        className="text-xs"
                      >
                        {isSavingModal ? "Saving..." : "Save Changes"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="black"
                        onClick={handleCloseModal}
                        className="text-xs"
                      >
                        Done
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {itemToDelete && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-black/65 backdrop-blur-xs"
                onClick={handleCancelDelete}
              />

              {/* Dialog Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden my-auto p-5 sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start gap-3.5">
                  <div className="size-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-heading font-semibold text-zinc-900 dark:text-white">
                      Delete Saved Question?
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      This action cannot be undone. This question and its saved
                      answer will be permanently removed from your vault.
                    </p>
                  </div>
                </div>

                {/* Question Preview Box */}
                <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800/80">
                  <div className="flex items-start gap-2">
                    <span className="inline-flex items-center justify-center size-4 rounded bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-[9px] shrink-0 mt-0.5">
                      Q
                    </span>
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-snug">
                      {itemToDelete.question}
                    </p>
                  </div>
                  {itemToDelete.answer && (
                    <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 pl-6 italic">
                      &ldquo;{itemToDelete.answer}&rdquo;
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                    className="text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="size-3.5" />
                        <span>Delete Question</span>
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Bottom Tip Tile */}
        <div className="mt-12 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 p-4 sm:p-5 flex items-start gap-3.5 max-w-2xl mx-auto shadow-xs">
          <div className="size-8 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="size-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Auto-sync with the Lazee Extension
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
              When applying on job boards or portals with the Lazee Chrome
              extension, you can click &quot;Save Answer&quot; to automatically
              add questions here. Clicking any card opens it in full modal for
              fast editing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
