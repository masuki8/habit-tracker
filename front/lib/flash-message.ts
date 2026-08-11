export type FlashMessage = {
  message: string;
  variant?: "success" | "info" | "error";
};

const FLASH_MESSAGE_KEY = "flashMessage";
const FLASH_MESSAGE_CHANGE_EVENT = "flash-message-change";

function notifyFlashMessageChange() {
  window.dispatchEvent(new Event(FLASH_MESSAGE_CHANGE_EVENT));
}

export function saveFlashMessage(flashMessage: FlashMessage) {
  sessionStorage.setItem(FLASH_MESSAGE_KEY, JSON.stringify(flashMessage));
  notifyFlashMessageChange();
}

export function getFlashMessage(): FlashMessage | null {
  const value = sessionStorage.getItem(FLASH_MESSAGE_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as FlashMessage;
  } catch {
    return null;
  }
}

export function clearFlashMessage() {
  sessionStorage.removeItem(FLASH_MESSAGE_KEY);
  notifyFlashMessageChange();
}

export function subscribeToFlashMessage(onStoreChange: () => void) {
  window.addEventListener(FLASH_MESSAGE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener(FLASH_MESSAGE_CHANGE_EVENT, onStoreChange);
  };
}
