<script setup>
definePageMeta({
  middleware: 'auth'
})

const { data: pokemons, error, pending } = await useFetch('/api/pokemons')


const columns = [
  {
    id: 'id',
    key: 'id',
    label: 'ID'
  },
  {
    id: 'name',
    key: 'name',
    label: 'Nom'
  },
  {
    id: 'type',
    key: 'type',
    label: 'Tipus'
  },
  {
    id: 'generation',
    key: 'generation',
    label: 'Generació'
  },
  {
    id: 'imatge',
    key: 'imatge',
    label: 'Imatge'
  }
]
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Llista de Pokémons</h1>
          <pre class="text-xs bg-gray-800 text-white p-2 rounded">{{ pokemons }}</pre>
          <UButton color="primary" icon="i-heroicons-plus" label="Nou Pokémon" />
        </div>
      </template>

      <div v-if="error" class="p-4 bg-red-50 text-red-700 mb-4 rounded border border-red-200">
        <p class="font-bold">Error al carregar les dades:</p>
        <p class="text-sm">{{ error.statusCode }} - {{ error.message }}</p>
      </div>

      <ClientOnly>
        <UTable 
          :rows="pokemons || []" 
          :columns="columns" 
          :loading="pending"
        >
          <template #imatge-data="{ row }">
            <div v-if="row.imatge" class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <img :src="row.imatge" alt="Pokemon" class="max-w-full max-h-full">
            </div>
            <span v-else class="text-gray-400 text-xs italic">Sense imatge</span>
          </template>

          <template #actions-data="{ row }">
            <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" />
            <UButton color="red" variant="ghost" icon="i-heroicons-trash" />
          </template>
        </UTable>

        <template #placeholder>
          <div class="p-8 text-center">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
            <p class="mt-2 text-gray-500">Carregant taula...</p>
          </div>
        </template>
      </ClientOnly>

      <template #footer>
        <div class="flex justify-between items-center text-xs text-gray-500">
          <span>Dades rebudes: <strong>{{ pokemons ? pokemons.length : 0 }}</strong> registres.</span>
          <span v-if="pending">Actualitzant dades...</span>
        </div>
      </template>
    </UCard>
  </UContainer>
</template>