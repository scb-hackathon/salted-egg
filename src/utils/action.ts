export const Action = (type: string) => (payload: object) =>
  JSON.stringify({type, payload})