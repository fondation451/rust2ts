import { readdirSync, statSync } from "fs";

const isDirectory = (fileOrDirectory: string): boolean => {
  const stats = statSync(fileOrDirectory);

  return stats.isDirectory();
};

const isFile = (fileOrDirectory: string): boolean => {
  const stats = statSync(fileOrDirectory);

  return stats.isFile();
};

const shouldIgnoreFileOrDirectory = (fileOrDirectory: string): boolean => {
  return (
    fileOrDirectory.startsWith(".") || fileOrDirectory.startsWith("@") || ["node_modules"].includes(fileOrDirectory)
  );
};

export const listAllRustFiles = (root: string): string[] => {
  const filesOrDirectories = readdirSync(root);
  const files = [] as string[];

  for (const fileOrDirectory of filesOrDirectories) {
    const fileOrDirectoryPath = `${root}/${fileOrDirectory}`;

    if (shouldIgnoreFileOrDirectory(fileOrDirectory)) {
      continue;
    }

    if (isFile(fileOrDirectoryPath) && fileOrDirectoryPath.endsWith(".rs")) {
      files.push(fileOrDirectoryPath);
    } else if (isDirectory(fileOrDirectoryPath)) {
      const subFiles = listAllRustFiles(fileOrDirectoryPath);

      for (const subFile of subFiles) {
        files.push(subFile);
      }
    }
  }

  return files;
};
