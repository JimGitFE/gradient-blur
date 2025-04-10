declare module "*.module.scss" {
   const classes: { [key: string]: string }
   export default classes
}

interface Point {
   /** Position */
   x: number
   /** Amount (blur) */
   y: number
}

/** inPU */
interface Handle {
   pos: number
   blur: number
}
