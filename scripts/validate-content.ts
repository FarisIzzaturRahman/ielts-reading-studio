import { contentLibrary } from "../src/data/content-library";
import { validateContentLibrary } from "../src/lib/validation/content";

const report = validateContentLibrary(contentLibrary);

const { errors, warnings, checkedItems } = report.summary;

console.log(`Content validation checked ${checkedItems} items.`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

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
