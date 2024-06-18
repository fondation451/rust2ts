import { compileRustToTs } from "./compileRustToTs";
import { listAllRustFiles } from "./listAllRustFiles";

const main = () => {
  const files = listAllRustFiles(".");

  for (let index = 0; index < files.length; index++) {
    const file = files[index]!;

    console.log(`[${index + 1}/${files.length}] Compiling ${file}`);

    compileRustToTs(file);
  }
};

main();
