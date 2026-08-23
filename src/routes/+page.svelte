<script lang="ts">
  const packageName = '@epsilonode/wx-font';
</script>

<svelte:head>
  <title>wx-font preview</title>
</svelte:head>

<main class="min-h-screen bg-slate-950 text-slate-100">
  <section class="mx-auto max-w-4xl px-6 py-16">
    <p class="text-sm uppercase tracking-widest text-sky-300">{packageName}</p>
    <h1 class="mt-3 text-4xl font-semibold tracking-tight">WMO weather icon font preview</h1>
    <p class="mt-4 max-w-2xl text-slate-300">
      Preview routes may use UnoCSS for downstream merge compatibility. Exported library components
      should remain self-contained with scoped CSS and CSS variables.
    </p>
  </section>
</main>
