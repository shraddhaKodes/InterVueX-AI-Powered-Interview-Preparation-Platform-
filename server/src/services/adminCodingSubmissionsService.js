import { CodingSubmission } from "../models/CodingSubmissionSchema.js";
import { Problem } from "../models/ProblemSchema.js";
import { User } from "../models/UserSchema.js";
import ErrorHandler from "../middlewares/error.js";
import {
  buildPaginationMeta as buildMeta,
  getSort as sortFn,
} from "./queryService.js";

export const getAllSubmissionsService = async (query) => {
  const { page, limit, skip } = (() => {
    const p = Number(query.page) || 1;
    const l = Number(query.limit) || 20;
    const s = (p - 1) * l;
    return { page: p, limit: l, skip: s };
  })();

  const filter = {};

  if (query.verdict) filter.verdict = query.verdict;
  if (query.language) filter.language = query.language;
  if (query.problemTitle) {
    filter.problemTitle = new RegExp(query.problemTitle, "i");
  }

  const [submissions, total] = await Promise.all([
    CodingSubmission.find(filter)
      .sort(sortFn(query) || { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "fullName email role")
      .populate("problem", "title slug difficulty"),
    CodingSubmission.countDocuments(filter),
  ]);

  return {
    submissions,
    pagination: buildMeta(total, page, limit),
  };
};

export const getSubmissionByIdAdminService = async (id) => {
  const submission = await CodingSubmission.findById(id)
    .populate("user", "fullName email role")
    .populate("problem", "title slug difficulty")
    .select("-testcaseResults");

  if (!submission) throw new ErrorHandler("Coding submission not found", 404);

  return submission;
};
