export function localPhotoDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

export function fitPhotoLabel(ctx: Pick<CanvasRenderingContext2D, 'font' | 'measureText'>, text: string, fontFamily: string, preferredSize: number, maxWidth: number): number {
  let low=0, high=preferredSize;
  for(let i=0;i<14;i++) {
    const size=(low+high)/2;
    ctx.font=`bold ${size}px ${fontFamily}`;
    if(ctx.measureText(text).width<=maxWidth) low=size; else high=size;
  }
  ctx.font=`bold ${low}px ${fontFamily}`;
  return low;
}
