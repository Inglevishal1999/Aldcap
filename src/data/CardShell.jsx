import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * CardShell
 * Shared header + body wrapper used by ImageGalleryCard, NewsCard, and
 * RosterCard so all three cards look consistent (icon chip, bold title,
 * "view all" link) without repeating the markup in every file.
 */
export default function CardShell({
  icon,
  title,
  viewAllLabel = "VIEW ALL",
  children,
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-700">
            {icon}
          </span>
          <h3 className="text-[15px] font-bold tracking-wide text-slate-900">
            {title}
          </h3>
        </div>
        <a
          href="#"
          className="group flex items-center gap-1 text-xs font-semibold tracking-wide text-blue-700 hover:text-amber-500"
        >
          {viewAllLabel}
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
      <div className="flex-1 p-5">{children}</div>
    </div>
  );
}
