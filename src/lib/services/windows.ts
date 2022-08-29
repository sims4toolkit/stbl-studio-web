export type WindowType = "help" | "settings" | "tokens" | "hasher";
export type WindowAction = "open" | "close";
export type WindowSubscription = (type: WindowType, action?: WindowAction, args?: object) => void;
export type WindowUnsubscriber = () => void;

class _WindowManager {
  private _nextId = 0;
  private readonly _subscriptions = new Map<number, WindowSubscription>();

  subscribe(fn: WindowSubscription): WindowUnsubscriber {
    const id = this._nextId++;
    this._subscriptions.set(id, fn);
    return () => this._subscriptions.delete(id);
  }

  request(type: WindowType, action: WindowAction = "open", args?: object) {
    this._subscriptions.forEach(subscription => {
      subscription(type, action, args);
    });
  }
}

const WindowManager = new _WindowManager();
export default WindowManager;
