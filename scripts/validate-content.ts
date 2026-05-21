import { contentLibrary } from "../src/data/content-library";
import { analyzeContentLibrary } from "../src/lib/content-quality";
import { validateContentLibrary } from "../src/lib/validation/content";

const report = validateContentLibrary(contentLibrary);
const quality = analyzeContentLibrary(contentLibrary);

const { errors, warnings, checkedItems } = report.summary;

console.log(`Content validation checked ${checkedItems} items.`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);
console.log("");
console.log(
  `Library scale: ${quality.totals.tests} mini tests, ${quality.totals.drills} drills, ${quality.totals.lessons} lessons, ${quality.totals.testQuestions} test questions, ${quality.totals.drillQuestions} drill questions.`,
);
console.log(
  `Difficulty mix: ${quality.difficultyDistribution.map((entry) => `${entry.label} ${entry.count}`).join(", ")}`,
);
console.log(
  `Question-type drill coverage: ${quality.coverageGaps.questionTypesWithoutDrills.length ? `${quality.coverageGaps.questionTypesWithoutDrills.length} types intentionally held for later realism batches` : "all question types have drills"}.`,
);
console.log(
  `Skill drill coverage: ${quality.coverageGaps.skillsWithoutDrills.length ? `${quality.coverageGaps.skillsWithoutDrills.length} skills intentionally held for later realism batches` : "all skills have drills"}.`,
);
console.log(
  `Trap drill coverage: ${quality.coverageGaps.trapsWithoutDrills.length ? `${quality.coverageGaps.trapsWithoutDrills.length} traps intentionally held for later realism batches` : "all major traps have drills"}.`,
);

if (report.issues.length) {
  console.log("");
  for (const item of report.issues.slice(0, 80)) {
    console.log(`[${item.severity.toUpperCase()}] ${item.contentType}:${item.contentId} ${item.field} - ${item.message}`);
  }

  if (report.issues.length > 80) {
    console.log(`...and ${report.issues.length - 80} more issues.`);
  }
}

if (errors > 0) {
  process.exitCode = 1;
}
