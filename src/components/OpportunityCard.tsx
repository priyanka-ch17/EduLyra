
import {
  ArrowUpRight,
  Bookmark,
  MapPin,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import type { Opportunity } from "../types";

import {
  applyToOpportunity,
  getMyData,
  saveOpportunity,
  removeSavedOpportunity,
  withdrawApplication,
} from "../services/store";

export function OpportunityCard({
  opportunity,
  onApply,
}: {
  opportunity: Opportunity;
  onApply?: (o: Opportunity) => void;
}) {
  const nav = useNavigate();

  const myData: any = getMyData();

  const [applied, setApplied] = useState(
    !!myData?.applications?.some(
      (a: any) => a.opportunityId === opportunity.id
    )
  );

  const [saved, setSaved] = useState(
    !!(
      myData?.profile?.savedOpportunities?.includes(opportunity.id) ||
      myData?.savedOpportunities?.includes(opportunity.id)
    )
  );

  const role = myData?.role;

  const base =
    role === "faculty"
      ? "/faculty/opportunities"
      : "/student/opportunities";

  // Save / Unsave opportunity
  const handleSave = () => {
    if (saved) {
      removeSavedOpportunity(opportunity.id);
      setSaved(false);
    } else {
      saveOpportunity(opportunity);
      setSaved(true);
    }
  };

  // Apply / Withdraw application
  const handleApply = () => {
    if (applied) {
      withdrawApplication(opportunity.id);
      setApplied(false);
    } else {
      applyToOpportunity(opportunity);
      setApplied(true);
      onApply?.(opportunity);
    }
  };

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="badge bg-cyan-50 text-cyan-700">
            {opportunity.type}
          </span>

          <h3 className="mt-3 font-bold">
            {opportunity.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {opportunity.company}
          </p>
        </div>

        <span className="badge bg-emerald-50 text-emerald-700">
          {opportunity.match || "—"}% match
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm leading-6 text-slate-500">
        {opportunity.description}
      </p>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {opportunity.skills.slice(0, 4).map((skill) => (
          <span
            className="badge bg-slate-100 text-slate-600"
            key={skill}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Opportunity Information */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} />
          {opportunity.location}
        </span>

        <span>{opportunity.workMode}</span>

        <span>{opportunity.compensation}</span>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex gap-2">
        {/* View Details */}
        <button
          className="btn-secondary flex-1"
          onClick={() => nav(`${base}/${opportunity.id}`)}
        >
          <ArrowUpRight size={15} />
          View Details
        </button>

        {/* Save / Unsave */}
        <button
          className={`btn-secondary ${
            saved ? "bg-violet-100 text-violet-700" : ""
          }`}
          title={saved ? "Unsave Opportunity" : "Save Opportunity"}
          onClick={handleSave}
        >
          <Bookmark
            size={15}
            fill={saved ? "currentColor" : "none"}
          />

          {saved ? "Saved" : "Save"}
        </button>

        {/* Apply / Withdraw */}
        {role === "student" || role === "faculty" ? (
          <button
            className={`btn-primary flex-1 ${
              applied ? "bg-red-500 hover:bg-red-600" : ""
            }`}
            onClick={handleApply}
          >
            {applied ? (
              <>
                <CheckCircle2 size={15} />
                Withdraw
              </>
            ) : (
              "Apply"
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}