import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const CARGO_FILE_PATH = "./Cargo.toml";
const CARGO_LOCK_FILE_PATH = "./Cargo.lock";

const generateCargoFile = (file: string): void => {
  writeFileSync(
    CARGO_FILE_PATH,
    `
[package]
name = "rustts-${Math.floor(Math.random() * 10000000)}"
version = "1.0.0"
authors = ["rustts compiler"]
edition = "2018"

[lib]
crate-type = ["cdylib", "rlib"]
path = "${file}"

[features]
default = ["console_error_panic_hook"]

[dependencies]
wasm-bindgen = "0.2.84"
console_error_panic_hook = { version = "0.1.7", optional = true }

[dev-dependencies]
wasm-bindgen-test = "0.3.34"

[profile.release]
opt-level = 3`,
    { flag: "w+" },
  );
};

export const compileRustToTs = (file: string): void => {
  generateCargoFile(file);
  execSync("wasm-pack build --target bundler --no-pack --release --out-name lib");

  const wasmFile = readFileSync("./pkg/lib_bg.wasm");
  const wasm64 = wasmFile.toString("base64");
  const jsLib = readFileSync("./pkg/lib_bg.js").toString();

  const newJsLib = `/* eslint-disable */ 
${jsLib}

const bytes = Uint8Array.from(atob("${wasm64}"), (c) => c.charCodeAt(0));

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, {});
__wbg_set_wasm(wasmInstance.exports);
`;

  const fileWithoutExtension = file.substring(0, file.length - 3);
  writeFileSync(`${fileWithoutExtension}.js`, newJsLib, { flag: "w+" });
  execSync(`mv ./pkg/lib.d.ts ${fileWithoutExtension}.d.ts`);

  execSync(`rm -rf ./pkg`);
  execSync(`rm -rf ${CARGO_FILE_PATH}`);
  execSync(`rm -rf ${CARGO_LOCK_FILE_PATH}`);
};
