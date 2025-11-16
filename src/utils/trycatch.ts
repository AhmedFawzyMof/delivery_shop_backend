type Success<T> = {
  data: T;
  error: null;
};

type Failed = {
  data: null;
  error: Error;
};

type Result<T> = Success<T> | Failed;

export default async function tryCatch<T>(fn: Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn;
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error };
    }
    return { data: null, error: new Error("Unknown error") };
  }
}
