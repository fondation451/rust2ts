use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(x: isize, y: isize) -> isize {
    return x + y;
}
