const pendingUploads = new Map<string, File>();


export const uploadFileRegistry= (file: File) => {
    const requestId = crypto.randomUUID();
    pendingUploads.set(requestId, file);
    return requestId;
}

export function getFileFromRequestId(requestId: string): File | undefined {
  const file = pendingUploads.get(requestId);
  pendingUploads.delete(requestId);
  return file;
}
