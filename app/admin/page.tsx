<div className="mt-3 flex flex-wrap gap-2">
  <button
    onClick={() => openEdit(entry.id)}
    className="flex-1 min-w-[80px] rounded-xl bg-white px-2 py-1.5 text-xs font-bold text-[#1f5c3f]"
  >
    {editLoading ? "..." : "Editar"}
  </button>

  <button
    onClick={() => runAction(entry.id, "check-in")}
    disabled={isCancelled || isNoShow || isCompleted}
    className="flex-1 min-w-[80px] rounded-xl bg-[#1f5c3f] px-2 py-1.5 text-xs font-bold text-white disabled:opacity-40"
  >
    Check-in
  </button>

  <button
    onClick={() => runAction(entry.id, "no-show")}
    disabled={isCancelled || isNoShow || isCompleted}
    className="flex-1 min-w-[80px] rounded-xl bg-amber-500 px-2 py-1.5 text-xs font-bold text-white disabled:opacity-40"
  >
    No-show
  </button>

  <button
    onClick={() => runAction(entry.id, "cancel")}
    disabled={isCancelled || isCompleted}
    className="flex-1 min-w-[80px] rounded-xl bg-red-500 px-2 py-1.5 text-xs font-bold text-white disabled:opacity-40"
  >
    Cancelar
  </button>
</div>