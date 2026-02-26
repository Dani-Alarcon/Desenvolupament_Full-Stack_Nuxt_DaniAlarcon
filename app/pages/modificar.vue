<script setup>
import { z } from 'zod'

definePageMeta({
    middleware: ["auth"],
});

const toast = useToast();
const route = useRoute();
const idParam = route.query.id;

const schema = z.object({
    name: z.string().min(2, "El nom ha de tenir almenys 2 caràcters"),
    type: z.string().min(3, "Indica un tipus (Ex: Elèctric, Foc...)"),
    generation: z.number().min(1, "La generació ha de ser 1 o superior").max(10, "Màxim 10"),
    imatge: z.string().url("Ha de ser una URL vàlida").or(z.literal('')).optional()
});

const state = reactive({
    name: undefined,
    type: undefined,
    generation: 1,
    imatge: undefined
});

const { data: pokemons } = await useFetch('/api/pokemons');

watchEffect(() => {
    if (idParam && pokemons.value) {
        const pokemonActual = pokemons.value.find(p => p.id === Number(idParam));
        if (pokemonActual) {
            state.name = pokemonActual.name;
            state.type = pokemonActual.type;
            state.generation = pokemonActual.generation;
            state.imatge = pokemonActual.imatge;
        }
    }
});

async function onSubmit(event) {
    if (!idParam) {
        toast.add({ title: 'Falta l\'ID', description: 'No s\'ha trobat el Pokémon a editar.', color: 'red' });
        return;
    }

    try {
        await $fetch(`/api/pokemons?id=${idParam}`, {
            method: 'PUT',
            body: event.data
        });

        toast.add({
            title: 'Pokémon actualitzat!',
            description: `Les dades de ${state.name} s'han guardat correctament.`,
            color: 'green'
        });

        navigateTo('/pokemons');

    } catch (error) {
        toast.add({ title: 'Error al modificar', description: 'No s\'ha pogut actualitzar el registre.', color: 'red' });
    }
}
</script>

<template>
    <div class="edit-page-wrapper">
        <UCard class="edit-card">
            <template #header>
                <div class="header-decoration"></div>
                <h1 class="form-title">Editar Pokémon</h1>
                <p class="form-subtitle">Modifica la informació de la teva col·lecció.</p>
            </template>

            <UForm :schema="schema" :state="state" class="custom-form" @submit="onSubmit">

                <div class="form-grid">
                    <UFormField label="Nom del Pokémon" name="name" class="custom-field">
                        <UInput v-model="state.name" icon="i-heroicons-sparkles" />
                    </UFormField>

                    <UFormField label="Tipus Element" name="type" class="custom-field">
                        <UInput v-model="state.type" icon="i-heroicons-fire" />
                    </UFormField>

                    <UFormField label="Generació" name="generation" class="custom-field">
                        <UInput v-model.number="state.generation" type="number" icon="i-heroicons-numbered-list" />
                    </UFormField>

                    <UFormField label="URL de la Imatge" name="imatge" class="custom-field">
                        <UInput v-model="state.imatge" placeholder="Deixa buit per defecte" icon="i-heroicons-photo" />
                    </UFormField>
                </div>

                <div class="preview-section">
                    <p class="preview-label">Estat de la imatge actual:</p>
                    <div class="preview-box">
                        <img :src="state.imatge || 'https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg'"
                            alt="Preview" />
                    </div>
                </div>

                <div class="form-actions">
                    <UButton type="submit" class="btn-save">
                        Guardar Canvis
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
.edit-page-wrapper {
    min-height: 100vh;
    background-color: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.edit-card {
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
    background: linear-gradient(90deg, #f59e0b, #ef4444);
    /* Color més taronja/vermell per diferenciar-lo de Crear */
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
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 4px solid white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-cancel {
    justify-content: center;
    font-weight: 600;
    color: #94a3b8;
}
</style>