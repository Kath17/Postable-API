type ErrorInput = {
  [key: string]: string[] | undefined;
};

type ErrorOutput = {
  [key: string]: string;
};

export function formatErrors(errors: ErrorInput): ErrorOutput {
  const output: ErrorOutput = {};
  Object.keys(errors).forEach((key) => {
    const messages = errors[key];
    if (messages) output[key] = messages.join(", ");
  });

  return output;
}
