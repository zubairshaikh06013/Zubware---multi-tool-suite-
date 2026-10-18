/** The caller owns the returned object URL and releases it after using the decoded source. */
export function decodeBrowserImage(file: File): Promise<{image: HTMLImageElement; url: string}> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) resolve({image,url});
      else {URL.revokeObjectURL(url);reject(new Error('This image has invalid dimensions.'));}
    };
    image.onerror = () => {URL.revokeObjectURL(url);reject(new Error('This image cannot be decoded. Try JPG, PNG, or WebP.'));};
    image.src = url;
  });
}
