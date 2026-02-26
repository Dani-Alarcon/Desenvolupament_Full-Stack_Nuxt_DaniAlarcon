<script setup>
definePageMeta({
  middleware: ["auth"],
});

const toast = useToast();

const { data: llistaPokemons, refresh } = await useFetch("/api/pokemons");

// Funció per eliminar
async function eliminarPokemon(id) {
  try {
    await $fetch(`/api/pokemons?id=${id}`, { method: 'DELETE' });
    toast.add({ title: 'Pokémon eliminat', color: 'orange' });
    refresh();
  } catch (error) {
    toast.add({ title: 'Error al eliminar', color: 'red' });
  }
}
</script>

<template>
  <div class="pokedex-wrapper">
    <header class="pokedex-header">
      <div class="title-section">
        <h1 class="pokedex-title">Pokédex</h1>
        <span class="pokedex-count">{{ llistaPokemons?.length || 0 }} unitats</span>
      </div>
      <NuxtLink to="/crear" class="btn-add-new">
        <UIcon name="i-heroicons-plus-circle" class="w-6 h-6" />
        <span>Nou Pokemon</span>
      </NuxtLink>
    </header>

    <div v-if="llistaPokemons && llistaPokemons.length > 0" class="pokemon-grid">
      <div v-for="pokemon in llistaPokemons" :key="pokemon.id" class="pokemon-card">
        <div class="gen-badge">GEN {{ pokemon.generation }}</div>

        <div class="pokemon-image-section">
          <div class="image-circle">
            <img v-if="pokemon.imatge" :src="pokemon.imatge" alt="Pokemon" />
            <UIcon v-else name="i-heroicons-bolt" class="w-12 h-12 text-gray-300" />
          </div>
        </div>

        <div class="pokemon-info">
          <h2 class="pokemon-name">{{ pokemon.name }}</h2>
          <div class="pokemon-type-pill">{{ pokemon.type }}</div>
        </div>

        <div class="card-actions">
          <NuxtLink :to="`/modificar?id=${pokemon.id}`" class="action-btn edit" title="Editar">
            <UIcon name="i-heroicons-pencil" />
          </NuxtLink>
          <button @click="eliminarPokemon(pokemon.id)" class="action-btn delete" title="Eliminar">
            <UIcon name="i-heroicons-trash" />
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-pokedex">
      <div class="empty-icon-wrapper">
        <UIcon name="i-heroicons-archive-box-x-mark" />
      </div>
      <h3>La Pokédex està buida</h3>
      <p>Sembla que encara no has capturat cap Pokémon.</p>
      <NuxtLink to="/crear" class="link-start">Comença la teva col·lecció</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.pokedex-wrapper {
  padding: 3rem 1rem;
  min-height: 100vh;
}

.pokedex-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1100px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.pokedex-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #1a202c;
  letter-spacing: -1px;
}

.pokedex-count {
  display: block;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.btn-add-new {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1a202c;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-add-new:hover {
  transform: translateY(-3px);
  background-color: #2d3748;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.pokemon-card {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid transparent;
  text-align: center;
}

.pokemon-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.gen-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #edf2f7;
  color: #4a5568;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
}

.pokemon-image-section {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

.image-circle {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #ffffff 0%, #f7fafc 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #f0f4f8;
  overflow: hidden;
}

.image-circle img {
  width: 85%;
  height: 85%;
  object-fit: contain;
}

.pokemon-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.pokemon-type-pill {
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  padding: 0.3rem 1.2rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.card-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  border-top: 1px solid #edf2f7;
  padding-top: 1.2rem;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: #f7fafc;
}

.action-btn.edit {
  color: #4a5568;
}

.action-btn.delete {
  color: #e53e3e;
}

.action-btn:hover {
  background: #edf2f7;
  transform: scale(1.1);
}

.empty-pokedex {
  text-align: center;
  padding: 5rem 1rem;
}

.empty-icon-wrapper {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.link-start {
  color: #3b82f6;
  font-weight: 700;
  text-decoration: underline;
  display: block;
  margin-top: 1rem;
}
</style>