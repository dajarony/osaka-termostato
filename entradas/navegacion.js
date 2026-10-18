/* SUME DOCBLOCK
Nombre: navegación | Tipo: Entrada
Entradas: activación de pestañas por ratón o teclado.
Acciones: cambiar sección sin recrear sesión.
Salidas: región accesible activa.
*/
export function createNavigation(root, render) {
  const tabs = [...root.querySelectorAll('[role=tab]')];
  function navigate(id) {
    if (!tabs.some((t) => t.dataset.view === id)) return;
    tabs.forEach((tab) => {
      const selected = tab.dataset.view === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      root.querySelector(`#view-${tab.dataset.view}`).hidden = !selected;
    });
    render();
  }
  tabs.forEach(
    (tab, index) =>
      (tab.onkeydown = (e) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault();
        const next =
          e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? tabs.length - 1
              : (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].focus();
        navigate(tabs[next].dataset.view);
      }),
  );
  return navigate;
}
