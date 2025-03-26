interface Point {
    /** Position */
    x: number
    /** Amount (blur) */
    y: number
 }
 
 interface Props {
    /** sampling rate / interval (low => Aliasing) */
    intervals: number
    /** Data points  */
    points: Point[]
 }

 interface Handle {
     pos: number
    blur: number
 }