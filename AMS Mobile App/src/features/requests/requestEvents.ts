type Listener = () => void;

const listeners = new Set<Listener>();

export const emitEmployeeRequestChanged = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeEmployeeRequestChanged = (listener: Listener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};
