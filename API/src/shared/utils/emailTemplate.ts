import fs from "fs";
import path from "path";

/**
 * Loads HTML file and replaces placeholders in format ${key}
 */
export const getEmailTemplate = (
  templateName: string,
  placeholders: Record<string, string>
): string => {
  const filePath = path.join(
    __dirname,
    "..",
    "templates",
    "email",
    `${templateName}.html`
  );

  let template = fs.readFileSync(filePath, "utf-8");

  for (const key in placeholders) {
    const regex = new RegExp(`\\$\\{${key}\\}`, "g");
    template = template.replace(regex, placeholders[key]);
  }

  return template;
};
