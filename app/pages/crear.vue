<script setup>
import { z } from 'zod'

definePageMeta({
  middleware: ["auth"],
});

const toast = useToast();

// Esquema de validació amb Zod
const schema = z.object({
  name: z.string().min(2, "El nom ha de tenir almenys 2 caràcters"),
  type: z.string().min(3, "Indica un tipus (Ex: Elèctric, Foc...)"),
  generation: z.number().min(1, "La generació ha de ser 1 o superior").max(10, "Màxim generació 10"),
  imatge: z.string().url("Ha de ser una URL vàlida").or(z.literal('')).optional() 
});

const state = reactive({
  name: undefined,
  type: undefined,
  generation: 1,
  imatge: undefined
});

async function onSubmit(event) {
  try {
    // Fem una còpia de les dades del formulari
    const payload = { ...event.data };

    // SI LA IMATGE ESTÀ BUIDA: L'eliminem de l'objecte.
    // D'aquesta manera, Drizzle/SQLite aplicarà el .default() del teu schema.ts
    if (!payload.imatge || payload.imatge.trim() === "") {
      delete payload.imatge;
    }

    await $fetch('/api/pokemons', {
      method: 'POST',
      body: payload
    });

    toast.add({ 
      title: 'Pokémon capturat!', 
      description: `${state.name} s'ha afegit correctament.`,
      color: 'green' 
    });

    // Naveguem a la llista (ajusta la ruta si és / o /pokemons)
    navigateTo('/pokemons'); 

  } catch (error) {
    toast.add({ 
      title: 'Error en la captura', 
      description: 'Revisa les dades o intenta-ho més tard.', 
      color: 'red' 
    });
  }
}
</script>

<template>
  <div class="create-page-wrapper">
    <UCard class="create-card">
      <template #header>
        <div class="header-decoration"></div>
        <h1 class="form-title">Nou Registre</h1>
        <p class="form-subtitle">Completa la fitxa per afegir un nou Pokémon a la col·lecció.</p>
      </template>

      <UForm :schema="schema" :state="state" class="custom-form" @submit="onSubmit">
        
        <div class="form-grid">
          <UFormField label="Nom del Pokémon" name="name" class="custom-field">
            <UInput v-model="state.name" placeholder="Ex: Pikachu" icon="i-heroicons-sparkles" />
          </UFormField>
          
          <UFormField label="Tipus Element" name="type" class="custom-field">
            <UInput v-model="state.type" placeholder="Ex: Elèctric" icon="i-heroicons-fire" />
          </UFormField>

          <UFormField label="Generació" name="generation" class="custom-field">
            <UInput v-model.number="state.generation" type="number" icon="i-heroicons-numbered-list" />
          </UFormField>

          <UFormField label="URL de la Imatge" name="imatge" class="custom-field">
            <UInput v-model="state.imatge" placeholder="Deixa buit per defecte" icon="i-heroicons-photo" />
          </UFormField>
        </div>

        <div class="preview-section">
          <p class="preview-label">Imatge del pokemon</p>
          <div class="preview-box">
            <img 
              :src="state.imatge || 'https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg'" 
              alt="Preview" 
            />
          </div>
          <p v-if="!state.imatge" class="preview-help text-xs text-gray-400 mt-2">
            Es posara una pokeBall per defecte
          </p>
        </div>

        <div class="form-actions">
          <UButton type="submit" class="btn-save">
            Finalitzar Registre
          </UButton>
          
          <UButton as-child color="gray" variant="ghost" class="btn-cancel">
            <NuxtLink to="/pokemons">Tornar a la pokedex</NuxtLink>
          </UButton>
        </div>

      </UForm>
    </UCard>
  </div>
</template>

<style scoped>
.create-page-wrapper {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.create-card {
  width: 100%;
  max-width: 550px;
  border-radius: 24px;
  border: none;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #3b82f6, #10b981);
}

.form-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
  text-align: center;
  margin-top: 1rem;
}

.form-subtitle {
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.custom-form {
  padding: 1rem 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.custom-field {
  margin-bottom: 1rem;
}

.preview-section {
  margin-top: 1.5rem;
  text-align: center;
  background: #f1f5f9;
  padding: 1.5rem;
  border-radius: 20px;
  border: 2px dashed #e2e8f0;
}

.preview-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preview-box {
  width: 110px;
  height: 110px;
  margin: 0 auto;
  background: white;
  border-radius: 50%; /* Ara és circular com a la llista principal */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.preview-box img {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

.form-actions {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-save {
  background-color: #1e293b;
  color: white;
  padding: 0.85rem;
  border-radius: 14px;
  font-weight: 700;
  justify-content: center;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-save:hover {
  background-color: #0f172a;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}

.btn-cancel {
  justify-content: center;
  font-weight: 600;
  color: #94a3b8;
}
</style>