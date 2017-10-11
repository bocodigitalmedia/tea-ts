declare module "setimmediate" {
  export default function setImmediate(fn: (...args: any[]) => any, args?: any[]): any
}
