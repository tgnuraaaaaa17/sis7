import { useEffect, useState } from 'react';

export default function PwaStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    let registration;
    let reloadOnControllerChange = false;

    navigator.serviceWorker?.ready.then((ready) => {
      registration = ready;
      const check = () => setWaitingWorker(registration.waiting && navigator.serviceWorker.controller ? registration.waiting : null);
      check();
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        installing?.addEventListener('statechange', check);
      });
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloadOnControllerChange) window.location.reload();
      });
    }).catch(() => {});

    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const applyUpdate = () => {
    if (!waitingWorker) return;
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true });
    waitingWorker.postMessage('SKIP_WAITING');
  };

  return <div className={`pwa-status ${online ? 'pwa-status--online' : 'pwa-status--offline'}`} role="status" aria-live="polite">
    <span className="pwa-status__dot" />
    <span>{online ? 'Online' : 'Offline · showing saved data'}</span>
    {!online && <a href="#/offline">Offline help</a>}
    {waitingWorker && <><span className="pwa-status__update">A new version is ready.</span><button className="btn btn--small" type="button" onClick={applyUpdate}>Update now</button></>}
  </div>;
}
