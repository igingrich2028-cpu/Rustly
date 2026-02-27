'use server';

export type CompilationResult = {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
};

/**
 * OFFICIAL RUST PLAYGROUND API INTEGRATION
 * 
 * This function communicates with the official Rust Playground API
 * to compile and execute Rust code in a secure, production environment.
 * 
 * API Endpoint: https://play.rust-lang.org/execute
 */
export async function compileRustCode(mainCode: string, cargoCode: string): Promise<CompilationResult> {
  try {
    const url = 'https://play.rust-lang.org/execute';

    // Official Playground API payload
    // We target the Stable channel and 2021 edition.
    const payload = {
      channel: "stable",
      mode: "debug",
      edition: "2021",
      crateType: "bin",
      tests: false,
      code: mainCode,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Rust Playground Error: ${response.statusText}`);
    }

    const data = await response.json();

    // The Playground returns success as a boolean
    // stderr contains compilation logs and compiler errors
    // stdout contains program output
    return {
      success: data.success,
      stdout: data.stdout || '',
      stderr: data.stderr || '',
      exitCode: data.success ? 0 : 1,
    };
  } catch (error) {
    console.error('Compilation Service Error:', error);
    return {
      success: false,
      stdout: '',
      stderr: `[BUILD SYSTEM ERROR] Could not connect to official Rust Playground.\nDetails: ${error instanceof Error ? error.message : String(error)}`,
      exitCode: 1,
    };
  }
}
