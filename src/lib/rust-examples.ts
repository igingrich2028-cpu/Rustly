export const RUST_EXAMPLES = [
  {
    id: 'hello-world',
    title: 'Hello World',
    code: `fn main() {\n    println!("Hello, Rustly!");\n}`,
    description: 'The classic introductory program.'
  },
  {
    id: 'variables',
    title: 'Variables & Mutability',
    code: `fn main() {\n    let mut x = 5;\n    println!("The value of x is: {x}");\n    x = 6;\n    println!("The value of x is now: {x}");\n}`,
    description: 'Demonstrating how variables work in Rust.'
  },
  {
    id: 'error-demo',
    title: 'Compiler Error Demo',
    code: `fn main() {\n    let x: i32 = "Not a number";\n    println!("x is {x}");\n}`,
    description: 'Example that triggers a type mismatch error to test the AI Explainer.'
  },
  {
    id: 'functions',
    title: 'Functions',
    code: `fn main() {\n    let result = add(10, 20);\n    println!("10 + 20 = {result}");\n}\n\nfn add(a: i32, b: i32) -> i32 {\n    a + b\n}`,
    description: 'How to define and call functions.'
  }
];